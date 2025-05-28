import { UserAnswer, LearningProgress, LanguageHabits, ExportData } from '@/types';

const STORAGE_VERSION = '1.0.0';
const DB_NAME = 'GengokaDB';
const DB_VERSION = 1;

// IndexedDB の初期化
let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // ユーザー回答ストア
      if (!database.objectStoreNames.contains('answers')) {
        const answersStore = database.createObjectStore('answers', { keyPath: 'id' });
        answersStore.createIndex('problemId', 'problemId', { unique: false });
        answersStore.createIndex('submittedAt', 'submittedAt', { unique: false });
      }

      // 学習進捗ストア
      if (!database.objectStoreNames.contains('progress')) {
        database.createObjectStore('progress', { keyPath: 'id' });
      }

      // 言語化の癖ストア
      if (!database.objectStoreNames.contains('habits')) {
        const habitsStore = database.createObjectStore('habits', { keyPath: 'id' });
        habitsStore.createIndex('analyzedAt', 'analyzedAt', { unique: false });
      }
    };
  });
}

// ユーザー回答の保存
export async function saveAnswer(answer: UserAnswer): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['answers'], 'readwrite');
  const store = transaction.objectStore('answers');
  
  // Dateオブジェクトを文字列に変換
  const answerToSave = {
    ...answer,
    submittedAt: answer.submittedAt.toISOString(),
  };
  
  return new Promise((resolve, reject) => {
    const request = store.put(answerToSave);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ユーザー回答の取得
export async function getAnswers(): Promise<UserAnswer[]> {
  const database = await initDB();
  const transaction = database.transaction(['answers'], 'readonly');
  const store = transaction.objectStore('answers');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const answers = request.result.map((answer: UserAnswer) => ({
        ...answer,
        submittedAt: new Date(answer.submittedAt),
      }));
      resolve(answers);
    };
    request.onerror = () => reject(request.error);
  });
}

// 特定の問題に対する回答を取得
export async function getAnswerByProblemId(problemId: string): Promise<UserAnswer | null> {
  const database = await initDB();
  const transaction = database.transaction(['answers'], 'readonly');
  const store = transaction.objectStore('answers');
  const index = store.index('problemId');
  
  return new Promise((resolve, reject) => {
    const request = index.get(problemId);
    request.onsuccess = () => {
      const answer = request.result;
      if (answer) {
        resolve({
          ...answer,
          submittedAt: new Date(answer.submittedAt),
        });
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// 学習進捗の保存
export async function saveProgress(progress: LearningProgress): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['progress'], 'readwrite');
  const store = transaction.objectStore('progress');
  
  const progressToSave = {
    id: 'current',
    ...progress,
  };
  
  return new Promise((resolve, reject) => {
    const request = store.put(progressToSave);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 学習進捗の取得
export async function getProgress(): Promise<LearningProgress> {
  const database = await initDB();
  const transaction = database.transaction(['progress'], 'readonly');
  const store = transaction.objectStore('progress');
  
  return new Promise((resolve, reject) => {
    const request = store.get('current');
    request.onsuccess = () => {
      const progress = request.result;
      if (progress) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...progressData } = progress;
        resolve(progressData);
      } else {
        // デフォルトの進捗データ
        resolve({
          phase1: 0,
          phase2: 0,
          phase3: 0,
          totalProblems: 0,
          completedProblems: 0,
          averageScore: 0,
        });
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// 言語化の癖の保存
export async function saveHabits(habits: LanguageHabits): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['habits'], 'readwrite');
  const store = transaction.objectStore('habits');
  
  const habitsToSave = {
    ...habits,
    analyzedAt: habits.analyzedAt.toISOString(),
  };
  
  return new Promise((resolve, reject) => {
    const request = store.put(habitsToSave);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 最新の言語化の癖を取得
export async function getLatestHabits(): Promise<LanguageHabits | null> {
  const database = await initDB();
  const transaction = database.transaction(['habits'], 'readonly');
  const store = transaction.objectStore('habits');
  const index = store.index('analyzedAt');
  
  return new Promise((resolve, reject) => {
    const request = index.openCursor(null, 'prev'); // 最新順
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const habits = cursor.value;
        resolve({
          ...habits,
          analyzedAt: new Date(habits.analyzedAt),
        });
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// データのエクスポート
export async function exportData(): Promise<ExportData> {
  const [answers, progress, habits] = await Promise.all([
    getAnswers(),
    getProgress(),
    getLatestHabits(),
  ]);

  return {
    exportedAt: new Date(),
    version: STORAGE_VERSION,
    answers,
    progress,
    habits: habits || undefined,
  };
}

// データのインポート
export async function importData(data: ExportData): Promise<void> {
  const database = await initDB();
  
  // 既存のデータをクリア
  const clearTransaction = database.transaction(['answers', 'progress', 'habits'], 'readwrite');
  await Promise.all([
    clearObjectStore(clearTransaction.objectStore('answers')),
    clearObjectStore(clearTransaction.objectStore('progress')),
    clearObjectStore(clearTransaction.objectStore('habits')),
  ]);

  // 新しいデータをインポート
  for (const answer of data.answers) {
    await saveAnswer(answer);
  }
  
  await saveProgress(data.progress);
  
  if (data.habits) {
    await saveHabits(data.habits);
  }
}

// オブジェクトストアをクリア
function clearObjectStore(store: IDBObjectStore): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// データベースの削除（開発用）
export async function clearAllData(): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['answers', 'progress', 'habits'], 'readwrite');
  
  await Promise.all([
    clearObjectStore(transaction.objectStore('answers')),
    clearObjectStore(transaction.objectStore('progress')),
    clearObjectStore(transaction.objectStore('habits')),
  ]);
}

// 進捗の計算と更新
export async function updateProgress(): Promise<void> {
  const answers = await getAnswers();
  const completedAnswers = answers.filter(answer => answer.isCompleted);
  
  const phase1Answers = completedAnswers.filter(answer => answer.problemId.startsWith('phase1'));
  const phase2Answers = completedAnswers.filter(answer => answer.problemId.startsWith('phase2'));
  const phase3Answers = completedAnswers.filter(answer => answer.problemId.startsWith('phase3'));
  
  // フェーズごとの進捗率を計算（仮の問題数で計算）
  const PHASE1_TOTAL = 10;
  const PHASE2_TOTAL = 8;
  const PHASE3_TOTAL = 6;
  
  const totalProblems = PHASE1_TOTAL + PHASE2_TOTAL + PHASE3_TOTAL;
  const completedProblems = completedAnswers.length;
  
  // 平均スコアを計算
  const scoresWithFeedback = completedAnswers
    .filter(answer => answer.feedback?.score)
    .map(answer => answer.feedback!.score!);
  
  const averageScore = scoresWithFeedback.length > 0 
    ? scoresWithFeedback.reduce((sum, score) => sum + score, 0) / scoresWithFeedback.length
    : 0;

  const progress: LearningProgress = {
    phase1: Math.min(100, (phase1Answers.length / PHASE1_TOTAL) * 100),
    phase2: Math.min(100, (phase2Answers.length / PHASE2_TOTAL) * 100),
    phase3: Math.min(100, (phase3Answers.length / PHASE3_TOTAL) * 100),
    totalProblems,
    completedProblems,
    averageScore,
  };

  await saveProgress(progress);
} 