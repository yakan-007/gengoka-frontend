'use client'

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  description: string;
  badExample: string;
  template: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UserAnswer {
  problemId: string;
  userText: string;
  feedback?: string;
  score?: number;
  timestamp: Date;
}

export default function Phase1() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [showTemplate, setShowTemplate] = useState(false);

  // フェーズ1の問題データ
  const problems: Problem[] = [
    {
      id: 'p1-1',
      title: '会議の議事録作成依頼',
      description: '部下に会議の議事録作成を依頼する際の指示文を改善してください。',
      badExample: '会議の議事録をお願いします。よろしくお願いします。',
      template: '【件名】○○会議の議事録作成について\n\n【目的】\n【期限】\n【形式・要件】\n【提出方法】\n\nご不明な点がございましたら、お気軽にお声がけください。',
      category: '指示・依頼',
      difficulty: 'easy'
    },
    {
      id: 'p1-2',
      title: 'プロジェクト進捗報告',
      description: '上司への週次進捗報告メールを改善してください。',
      badExample: 'プロジェクトは順調に進んでいます。来週も頑張ります。',
      template: '【プロジェクト名】\n【報告期間】\n【今週の実績】\n・完了したタスク：\n・進行中のタスク：\n【来週の予定】\n【課題・懸念事項】\n【サポートが必要な事項】',
      category: '報告',
      difficulty: 'easy'
    },
    {
      id: 'p1-3',
      title: '顧客への提案書送付',
      description: '顧客に提案書を送付する際のメールを改善してください。',
      badExample: '提案書を送ります。確認してください。',
      template: '【件名】○○に関するご提案書について\n\n【提案の概要】\n【添付資料】\n【次のステップ】\n【回答期限】\n【連絡先】\n\nご質問やご不明な点がございましたら、いつでもお気軽にお声がけください。',
      category: '提案・営業',
      difficulty: 'medium'
    },
    {
      id: 'p1-4',
      title: '会議の日程調整',
      description: '複数の関係者との会議日程調整メールを改善してください。',
      badExample: '会議をしたいので、都合の良い日を教えてください。',
      template: '【件名】○○に関する会議の日程調整について\n\n【会議の目的】\n【参加者】\n【所要時間】\n【候補日時】\n・第1希望：\n・第2希望：\n・第3希望：\n【会議形式】（対面/オンライン）\n【回答期限】',
      category: '調整・連絡',
      difficulty: 'easy'
    },
    {
      id: 'p1-5',
      title: '問題発生時の報告',
      description: 'システム障害が発生した際の緊急報告メールを改善してください。',
      badExample: 'システムに問題が起きています。対応中です。',
      template: '【緊急】○○システム障害発生について\n\n【発生時刻】\n【影響範囲】\n【現在の状況】\n【原因（判明している場合）】\n【対応状況】\n【復旧見込み】\n【今後の報告予定】\n\n※状況に変化があり次第、随時ご報告いたします。',
      category: '緊急報告',
      difficulty: 'hard'
    }
  ];

  const currentProblem = problems[currentProblemIndex];

  useEffect(() => {
    // ローカルストレージから完了済み問題を読み込み
    const saved = localStorage.getItem('gengoka-phase1-completed');
    if (saved) {
      setCompletedProblems(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem_description: currentProblem.description,
          bad_example: currentProblem.badExample,
          user_answer: userAnswer,
          template: currentProblem.template,
          phase: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
        
        // 回答を保存
        const answer: UserAnswer = {
          problemId: currentProblem.id,
          userText: userAnswer,
          feedback: data.feedback,
          score: data.score,
          timestamp: new Date()
        };
        
        // ローカルストレージに保存
        const savedAnswers = JSON.parse(localStorage.getItem('gengoka-answers') || '[]');
        savedAnswers.push(answer);
        localStorage.setItem('gengoka-answers', JSON.stringify(savedAnswers));
        
        // 完了済みに追加
        const newCompleted = new Set(completedProblems);
        newCompleted.add(currentProblem.id);
        setCompletedProblems(newCompleted);
        localStorage.setItem('gengoka-phase1-completed', JSON.stringify([...newCompleted]));
        
        // 進捗を更新
        const progress = Math.round((newCompleted.size / problems.length) * 100);
        const savedProgress = JSON.parse(localStorage.getItem('gengoka-progress') || '{"phase1":0,"phase2":0,"phase3":0}');
        savedProgress.phase1 = progress;
        localStorage.setItem('gengoka-progress', JSON.stringify(savedProgress));
        
      } else {
        setFeedback('申し訳ございません。フィードバックの取得に失敗しました。もう一度お試しください。');
      }
    } catch {
      setFeedback('ネットワークエラーが発生しました。接続を確認してもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const nextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setShowTemplate(false);
    }
  };

  const prevProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      setUserAnswer('');
      setFeedback(null);
      setShowTemplate(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初級';
      case 'medium': return '中級';
      case 'hard': return '上級';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                ホームに戻る
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">フェーズ1: 基礎の確立</h1>
            </div>
            <div className="text-sm text-gray-600">
              {currentProblemIndex + 1} / {problems.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>進捗</span>
            <span>{Math.round((completedProblems.size / problems.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedProblems.size / problems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-900 mr-3">{currentProblem.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                {getDifficultyText(currentProblem.difficulty)}
              </span>
              {completedProblems.has(currentProblem.id) && (
                <CheckCircleIcon className="h-5 w-5 text-green-600 ml-2" />
              )}
            </div>
            <span className="text-sm text-gray-500">{currentProblem.category}</span>
          </div>
          
          <p className="text-gray-700 mb-6">{currentProblem.description}</p>

          {/* 悪い例 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-800">悪い例</h3>
            </div>
            <p className="text-red-700">{currentProblem.badExample}</p>
          </div>

          {/* テンプレート表示ボタン */}
          <div className="mb-6">
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <LightBulbIcon className="h-5 w-5 mr-2" />
              {showTemplate ? 'テンプレートを隠す' : 'テンプレートを表示'}
            </button>
            
            {showTemplate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <h3 className="font-semibold text-blue-800 mb-2">推奨テンプレート</h3>
                <pre className="text-blue-700 whitespace-pre-wrap text-sm">{currentProblem.template}</pre>
              </div>
            )}
          </div>

          {/* 回答入力 */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              あなたの改善案を入力してください
            </label>
            <textarea
              id="answer"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="悪い例を参考に、より効果的な文章を作成してください..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'AI添削中...' : 'AI添削を受ける'}
          </button>
        </div>

        {/* フィードバック表示 */}
        {feedback && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI フィードバック</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{feedback}</div>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <div className="flex justify-between">
          <button
            onClick={prevProblem}
            disabled={currentProblemIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            前の問題
          </button>
          
          <button
            onClick={nextProblem}
            disabled={currentProblemIndex === problems.length - 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            次の問題
            <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
          </button>
        </div>

        {/* 完了メッセージ */}
        {completedProblems.size === problems.length && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">フェーズ1完了！</h3>
                <p className="text-green-700 mt-1">
                  おめでとうございます！基礎的な「型」の習得が完了しました。
                  <Link href="/phase/2" className="text-green-600 hover:text-green-800 underline ml-2">
                    フェーズ2に進む
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 