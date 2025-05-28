'use client'

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  description: string;
  situation: string;
  objective: string;
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

export default function Phase2() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [showTemplate, setShowTemplate] = useState(false);

  // フェーズ2の問題データ（実践的な構成力と「伝わる指示」の強化）
  const problems: Problem[] = [
    {
      id: 'p2-1',
      title: '新商品発表会の準備指示',
      description: 'チームメンバーに新商品発表会の準備作業を分担・指示する実践的なケースです。',
      situation: '来月末に新商品「EcoSmart」の発表会を開催予定。参加者50名。会場はホテルの大会議室。デモンストレーション、資料配布、懇親会も実施する。',
      objective: 'チームの5名（デザイナー2名、エンジニア2名、営業1名）に対して、それぞれの専門性を活かした準備作業を効率的に分担・指示すること。',
      template: '【プロジェクト概要】\n【各担当者への指示】\n■ ○○さん（職種）\n・具体的タスク：\n・期限：\n・成果物：\n・注意点：\n\n【全体スケジュール】\n【定期報告・確認体制】\n【緊急時連絡先】',
      category: 'プロジェクト管理',
      difficulty: 'medium'
    },
    {
      id: 'p2-2',
      title: '顧客クレーム対応の改善提案',
      description: '顧客からのクレームを受けて、チーム全体での対応改善策を提案するケースです。',
      situation: '昨月、製品の不具合により顧客から3件のクレームが発生。対応に時間がかかり、顧客満足度が低下。今後の再発防止と迅速対応が急務。',
      objective: '上司に対して、クレーム対応の改善案を具体的かつ実行可能な形で提案し、承認を得ること。',
      template: '【現状の課題分析】\n【改善提案】\n1. 体制面の改善\n2. プロセスの改善\n3. 教育・研修の改善\n【実施スケジュール】\n【必要リソース】\n【期待効果・KPI】\n【リスクと対策】',
      category: '課題解決提案',
      difficulty: 'hard'
    },
    {
      id: 'p2-3',
      title: '部門間連携の効率化提案',
      description: '開発部門と営業部門の連携を改善するための具体的な施策を提案するケースです。',
      situation: '開発部門と営業部門の情報共有が不十分で、顧客要望の開発への反映が遅れている。月次売上目標の達成にも影響が出始めている。',
      objective: '両部門の管理職に対して、連携改善のための具体的な仕組みを提案し、実施への合意を得ること。',
      template: '【現状の連携課題】\n【改善案】\n■ 情報共有の仕組み\n■ 定期的な連携体制\n■ 責任・役割の明確化\n【実施方法】\n【成功指標】\n【段階的導入計画】',
      category: '組織改善',
      difficulty: 'hard'
    },
    {
      id: 'p2-4',
      title: '新人研修プログラムの企画提案',
      description: '来年度の新人研修プログラムを企画し、人事部に提案するケースです。',
      situation: '来年度は新卒5名、中途採用3名の入社予定。従来の研修は座学中心で実践力が身につかないとの課題があった。',
      objective: '人事部長に対して、実践的かつ効果的な新人研修プログラムを提案し、予算承認を得ること。',
      template: '【研修の目的・目標】\n【研修内容】\n■ 期間・スケジュール\n■ カリキュラム詳細\n■ 実習・実践内容\n【必要リソース・予算】\n【効果測定方法】\n【従来研修との差別化ポイント】',
      category: '企画提案',
      difficulty: 'medium'
    },
    {
      id: 'p2-5',
      title: '緊急システム障害の対応指示',
      description: '重要システムの障害発生時に、関係者への迅速かつ的確な対応指示を行うケースです。',
      situation: '金曜日18時、基幹システムが停止。月曜日の業務開始までに復旧必須。原因調査と復旧作業を並行して進める必要がある。',
      objective: 'システム担当者、外部ベンダー、関連部署に対して、役割分担と優先順位を明確にした緊急対応指示を出すこと。',
      template: '【緊急事態の概要】\n【復旧目標】\n【対応体制・役割分担】\n■ 内部チーム：\n■ 外部ベンダー：\n■ 関連部署：\n【対応優先順位】\n【報告・連絡体制】\n【進捗確認タイミング】',
      category: '緊急対応',
      difficulty: 'hard'
    }
  ];

  const currentProblem = problems[currentProblemIndex];

  useEffect(() => {
    // ローカルストレージから完了済み問題を読み込み
    const saved = localStorage.getItem('gengoka-phase2-completed');
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
          problem_description: `${currentProblem.description}\n\n【状況】${currentProblem.situation}\n\n【目的】${currentProblem.objective}`,
          bad_example: "構造化されていない、具体性に欠ける指示文",
          user_answer: userAnswer,
          template: currentProblem.template,
          phase: 2
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
        localStorage.setItem('gengoka-phase2-completed', JSON.stringify([...newCompleted]));
        
        // 進捗を更新
        const progress = Math.round((newCompleted.size / problems.length) * 100);
        const savedProgress = JSON.parse(localStorage.getItem('gengoka-progress') || '{"phase1":0,"phase2":0,"phase3":0}');
        savedProgress.phase2 = progress;
        localStorage.setItem('gengoka-progress', JSON.stringify(savedProgress));
        
      } else {
        setFeedback('申し訳ございません。フィードバックの取得に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
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
              <h1 className="text-2xl font-bold text-gray-900">フェーズ2: 実践的な構成力強化</h1>
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
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
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

          {/* 状況説明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">状況</h3>
            </div>
            <p className="text-blue-700">{currentProblem.situation}</p>
          </div>

          {/* 目的・課題 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <XCircleIcon className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-amber-800">達成目標</h3>
            </div>
            <p className="text-amber-700">{currentProblem.objective}</p>
          </div>

          {/* テンプレート表示ボタン */}
          <div className="mb-6">
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <LightBulbIcon className="h-5 w-5 mr-2" />
              {showTemplate ? 'テンプレートを隠す' : '推奨構成テンプレートを表示'}
            </button>
            
            {showTemplate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                <h3 className="font-semibold text-green-800 mb-2">推奨構成テンプレート</h3>
                <pre className="text-green-700 whitespace-pre-wrap text-sm">{currentProblem.template}</pre>
              </div>
            )}
          </div>

          {/* 回答入力 */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              実践的な指示文・提案文を作成してください
            </label>
            <textarea
              id="answer"
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="状況を踏まえ、目標達成に向けた効果的な指示文・提案文を作成してください..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
                <h3 className="text-lg font-semibold text-green-800">フェーズ2完了！</h3>
                <p className="text-green-700 mt-1">
                  お疲れ様でした！実践的な構成力が大幅に向上しました。
                  <Link href="/phase/3" className="text-green-600 hover:text-green-800 underline ml-2">
                    フェーズ3に進む
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