'use client'

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon, TrophyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface UserAnswer {
  problemId: string;
  userText: string;
  feedback?: string;
  score?: number;
  timestamp: Date;
}

interface HistoryStats {
  totalAnswers: number;
  averageScore: number;
  phase1Count: number;
  phase2Count: number;
  phase3Count: number;
  recentActivity: string;
}

export default function History() {
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<UserAnswer | null>(null);
  const [filterPhase, setFilterPhase] = useState<string>('all');

  // 問題IDから問題情報を取得する関数
  const getProblemInfo = (problemId: string) => {
    const phase = problemId.startsWith('p1-') ? '1' : problemId.startsWith('p2-') ? '2' : '3';
    const problemNumber = problemId.split('-')[1];
    
    const problemTitles: {[key: string]: string} = {
      'p1-1': '会議の議事録作成依頼',
      'p1-2': 'プロジェクト進捗報告',
      'p1-3': '顧客への提案書送付',
      'p1-4': '会議の日程調整',
      'p1-5': '問題発生時の報告',
      'p2-1': '新商品発表会の準備指示',
      'p2-2': '顧客クレーム対応の改善提案',
      'p2-3': '部門間連携の効率化提案',
      'p2-4': '新人研修プログラムの企画提案',
      'p2-5': '緊急システム障害の対応指示',
      'p3-1': '事業戦略変更の社内発表',
      'p3-2': '複雑な財務グラフの説明プレゼン',
      'p3-3': '危機管理における多方面コミュニケーション',
      'p3-4': 'M&A交渉の提案書作成',
      'p3-5': '国際展開戦略の包括的提案'
    };

    return {
      phase: `フェーズ${phase}`,
      title: problemTitles[problemId] || `問題 ${problemNumber}`,
      phaseColor: phase === '1' ? 'bg-blue-100 text-blue-800' : 
                 phase === '2' ? 'bg-green-100 text-green-800' : 
                 'bg-purple-100 text-purple-800'
    };
  };

  // スコアの色を取得
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    // ローカルストレージから回答履歴を読み込み
    const savedAnswers = localStorage.getItem('gengoka-answers');
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers).map((answer: UserAnswer) => ({
        ...answer,
        timestamp: new Date(answer.timestamp)
      }));
      
      // 新しい順に並び替え
      parsedAnswers.sort((a: UserAnswer, b: UserAnswer) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );
      
      setAnswers(parsedAnswers);

      // 統計情報の計算
      const totalAnswers = parsedAnswers.length;
      const scores = parsedAnswers.filter((a: UserAnswer) => a.score).map((a: UserAnswer) => a.score!);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length) : 0;
      
      const phase1Count = parsedAnswers.filter((a: UserAnswer) => a.problemId.startsWith('p1-')).length;
      const phase2Count = parsedAnswers.filter((a: UserAnswer) => a.problemId.startsWith('p2-')).length;
      const phase3Count = parsedAnswers.filter((a: UserAnswer) => a.problemId.startsWith('p3-')).length;
      
      const recentActivity = totalAnswers > 0 ? 
        `${parsedAnswers[0].timestamp.toLocaleDateString('ja-JP')}` : '履歴なし';

      setStats({
        totalAnswers,
        averageScore,
        phase1Count,
        phase2Count,
        phase3Count,
        recentActivity
      });
    }
  }, []);

  // フィルタリングされた回答
  const filteredAnswers = answers.filter(answer => {
    if (filterPhase === 'all') return true;
    return answer.problemId.startsWith(`p${filterPhase}-`);
  });

  const clearHistory = () => {
    if (confirm('学習履歴を全て削除してもよろしいですか？この操作は取り消せません。')) {
      localStorage.removeItem('gengoka-answers');
      setAnswers([]);
      setStats(null);
      setSelectedAnswer(null);
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
              <h1 className="text-2xl font-bold text-gray-900">学習履歴</h1>
            </div>
            {answers.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-red-600 hover:text-red-800 text-sm transition-colors"
              >
                履歴をクリア
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalAnswers}</div>
                <div className="text-sm text-gray-600">総回答数</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.averageScore}</div>
                <div className="text-sm text-gray-600">平均スコア</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-sm text-blue-600 font-medium mb-1">フェーズ1</div>
                <div className="text-xl font-bold text-gray-900">{stats.phase1Count}/5</div>
                <div className="text-xs text-gray-600">基礎</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-sm text-green-600 font-medium mb-1">フェーズ2</div>
                <div className="text-xl font-bold text-gray-900">{stats.phase2Count}/5</div>
                <div className="text-xs text-gray-600">実践</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-sm text-purple-600 font-medium mb-1">フェーズ3</div>
                <div className="text-xl font-bold text-gray-900">{stats.phase3Count}/5</div>
                <div className="text-xs text-gray-600">戦略</div>
              </div>
            </div>

            {/* フィルター */}
            <div className="mb-6">
              <div className="flex space-x-4">
                {['all', '1', '2', '3'].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setFilterPhase(phase)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterPhase === phase
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {phase === 'all' ? '全て' : `フェーズ${phase}`}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {answers.length === 0 ? (
          /* 履歴なしの場合 */
          <div className="text-center py-16">
            <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">学習履歴がありません</h3>
            <p className="text-gray-600 mb-6">問題を解いて、AI添削を受けると履歴が表示されます。</p>
            <Link
              href="/phase/1"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              学習を始める
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 回答履歴リスト */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                回答履歴 ({filteredAnswers.length}件)
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAnswers.map((answer, index) => {
                  const problemInfo = getProblemInfo(answer.problemId);
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedAnswer(answer)}
                      className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedAnswer === answer ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${problemInfo.phaseColor}`}>
                          {problemInfo.phase}
                        </span>
                        {answer.score && (
                          <span className={`text-sm font-medium ${getScoreColor(answer.score)}`}>
                            {answer.score}点
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {problemInfo.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {answer.timestamp.toLocaleDateString('ja-JP')} {answer.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 詳細表示 */}
            <div className="lg:col-span-2">
              {selectedAnswer ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getProblemInfo(selectedAnswer.problemId).title}
                    </h3>
                    {selectedAnswer.score && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className={`text-lg font-bold ${getScoreColor(selectedAnswer.score)}`}>
                          {selectedAnswer.score}点
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">あなたの回答</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                        {selectedAnswer.userText}
                      </pre>
                    </div>
                  </div>

                  {selectedAnswer.feedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI フィードバック</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="whitespace-pre-wrap text-gray-700 text-sm">
                          {selectedAnswer.feedback}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    提出日時: {selectedAnswer.timestamp.toLocaleDateString('ja-JP')} {selectedAnswer.timestamp.toLocaleTimeString('ja-JP')}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">左側から回答を選択すると詳細が表示されます</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 