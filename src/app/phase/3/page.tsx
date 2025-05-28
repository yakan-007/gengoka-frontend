'use client'

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, ChartBarIcon, LightBulbIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  description: string;
  scenario: string;
  stakeholders: string[];
  constraints: string[];
  successCriteria: string;
  template: string;
  category: string;
  difficulty: 'hard' | 'expert';
}

interface UserAnswer {
  problemId: string;
  userText: string;
  feedback?: string;
  score?: number;
  timestamp: Date;
}

export default function Phase3() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [showTemplate, setShowTemplate] = useState(false);

  // フェーズ3の問題データ（戦略的コミュニケーションと総合力の発揮）
  const problems: Problem[] = [
    {
      id: 'p3-1',
      title: '事業戦略変更の社内発表',
      description: '重要な事業戦略変更を全社員に向けて発表する際の戦略的コミュニケーション',
      scenario: '競合他社の台頭により、従来の主力事業の売上が30%減少。新規事業への転換が急務となり、既存事業の一部縮小と100名の配置転換が必要。',
      stakeholders: ['全社員（300名）', '経営陣', '労働組合', '既存顧客', '株主'],
      constraints: ['配置転換による不安の最小化', '顧客への影響を最小限に', '3ヶ月以内の実行必須', '離職率10%以下に抑制'],
      successCriteria: '社員の理解と協力を得て、スムーズな事業転換を実現し、新規事業の立ち上げに成功する',
      template: '【経営環境の変化と現状認識】\n【戦略変更の必要性・根拠】\n【新戦略の具体的内容】\n【社員への影響・配慮事項】\n【実行計画・スケジュール】\n【サポート体制】\n【今後のビジョン・期待】\n【質疑応答・フォローアップ】',
      category: '組織変革',
      difficulty: 'expert'
    },
    {
      id: 'p3-2',
      title: '複雑な財務グラフの説明プレゼン',
      description: '取締役会で四半期業績を多角的に分析し、次期戦略を提案する高度なプレゼンテーション',
      scenario: '売上は前年同期比+15%だが、利益率は-5%。新規顧客獲得は好調だが既存顧客の単価が下落。投資回収期間が予想より延長している。',
      stakeholders: ['取締役会（7名）', 'CFO', '事業部長（3名）', '株主代表'],
      constraints: ['15分のプレゼン時間', '数値の正確な説明必須', '次期投資判断への影響大', '楽観的過ぎない現実的分析要求'],
      successCriteria: '複雑な財務状況を正確に伝え、論理的根拠に基づく戦略提案で取締役会の承認を得る',
      template: '【業績サマリー】\n【要因分析】\n■ プラス要因：\n■ マイナス要因：\n■ 市場環境：\n【グラフ・データ説明】\n【リスクと機会】\n【対策・戦略提案】\n【投資効果予測】\n【実行可能性・根拠】',
      category: '経営分析',
      difficulty: 'expert'
    },
    {
      id: 'p3-3',
      title: '危機管理における多方面コミュニケーション',
      description: '製品リコール発生時の多様なステークホルダーへの同時対応戦略',
      scenario: '主力製品に安全上の欠陥が発覚。既に3件の軽傷事故報告あり。50万台のリコールが必要で、対応費用は20億円と予想される。',
      stakeholders: ['顧客（50万人）', 'メディア', '監督官庁', '販売代理店（200社）', '社員', '株主', '保険会社'],
      constraints: ['法的責任の明確化必須', '24時間以内の初期対応必要', 'ブランドイメージ最小限被害', '二次被害防止が最優先'],
      successCriteria: '迅速で透明性の高い対応により、顧客の安全確保とステークホルダーからの信頼維持を実現',
      template: '【事実関係の整理】\n【ステークホルダー別対応方針】\n■ 顧客向け：\n■ メディア向け：\n■ 官庁向け：\n■ 代理店向け：\n【対応スケジュール】\n【責任体制・窓口】\n【再発防止策】\n【フォローアップ計画】',
      category: '危機管理',
      difficulty: 'expert'
    },
    {
      id: 'p3-4',
      title: 'M&A交渉の提案書作成',
      description: '競合他社買収に向けた取締役会提案と交渉戦略の策定',
      scenario: '業界3位の競合他社（売上100億円、従業員500名）が売却検討中。買収により市場シェア40%達成可能だが、統合リスクと規制当局の審査が課題。',
      stakeholders: ['自社取締役会', '対象会社経営陣', '対象会社従業員', '規制当局', '自社株主', '投資銀行'],
      constraints: ['買収価格上限150億円', '独占禁止法の審査通過必須', '統合期間2年以内', '対象会社従業員の90%以上継続雇用'],
      successCriteria: '取締役会の承認を得て、対象会社との交渉開始の決議を獲得し、成功確率の高い買収計画を策定',
      template: '【M&A戦略の背景・意義】\n【対象会社分析】\n【シナジー効果試算】\n【買収スキーム・条件】\n【統合計画】\n【リスク分析・対策】\n【財務影響・投資回収】\n【実行スケジュール】\n【成功要因・KPI】',
      category: 'M&A戦略',
      difficulty: 'expert'
    },
    {
      id: 'p3-5',
      title: '国際展開戦略の包括的提案',
      description: 'アジア3カ国への同時進出計画を投資委員会に提案する戦略的コミュニケーション',
      scenario: '国内市場の成熟化により、海外展開が成長の鍵。タイ、ベトナム、インドネシアへの同時進出を検討。各国で異なる規制、文化、競合状況。',
      stakeholders: ['投資委員会', '海外事業部', '現地パートナー候補', '各国政府機関', '既存顧客', '金融機関'],
      constraints: ['初期投資予算30億円', '3年後の黒字化必須', '現地法規制の完全遵守', '既存事業への影響最小化'],
      successCriteria: '包括的な国際展開戦略により投資委員会の承認を得て、3カ国同時進出プロジェクトを開始',
      template: '【市場機会・成長可能性】\n【各国別戦略】\n■ 国名：\n・市場分析：\n・参入戦略：\n・リスク対策：\n【投資計画・収益予測】\n【実行体制・人材戦略】\n【段階的展開計画】\n【競合対策・差別化】\n【成功指標・撤退基準】',
      category: '国際戦略',
      difficulty: 'expert'
    }
  ];

  const currentProblem = problems[currentProblemIndex];

  useEffect(() => {
    // ローカルストレージから完了済み問題を読み込み
    const saved = localStorage.getItem('gengoka-phase3-completed');
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
          problem_description: `${currentProblem.description}\n\n【シナリオ】${currentProblem.scenario}\n\n【ステークホルダー】${currentProblem.stakeholders.join(', ')}\n\n【制約条件】${currentProblem.constraints.join(', ')}\n\n【成功基準】${currentProblem.successCriteria}`,
          bad_example: "戦略性に欠ける、ステークホルダーを考慮していない表面的な提案",
          user_answer: userAnswer,
          template: currentProblem.template,
          phase: 3
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
        localStorage.setItem('gengoka-phase3-completed', JSON.stringify([...newCompleted]));
        
        // 進捗を更新
        const progress = Math.round((newCompleted.size / problems.length) * 100);
        const savedProgress = JSON.parse(localStorage.getItem('gengoka-progress') || '{"phase1":0,"phase2":0,"phase3":0}');
        savedProgress.phase3 = progress;
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
      case 'hard': return 'text-red-600 bg-red-100';
      case 'expert': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return '上級';
      case 'expert': return 'エキスパート';
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
              <h1 className="text-2xl font-bold text-gray-900">フェーズ3: 戦略的コミュニケーション</h1>
            </div>
            <div className="text-sm text-gray-600">
              {currentProblemIndex + 1} / {problems.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>進捗</span>
            <span>{Math.round((completedProblems.size / problems.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                <CheckCircleIcon className="h-5 w-5 text-purple-600 ml-2" />
              )}
            </div>
            <span className="text-sm text-gray-500">{currentProblem.category}</span>
          </div>
          
          <p className="text-gray-700 mb-6">{currentProblem.description}</p>

          {/* シナリオ */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-800">シナリオ</h3>
            </div>
            <p className="text-purple-700">{currentProblem.scenario}</p>
          </div>

          {/* ステークホルダー */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">関係者（ステークホルダー）</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProblem.stakeholders.map((stakeholder, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>

          {/* 制約条件 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-800">制約条件</h3>
            </div>
            <ul className="text-orange-700">
              {currentProblem.constraints.map((constraint, index) => (
                <li key={index} className="mb-1">• {constraint}</li>
              ))}
            </ul>
          </div>

          {/* 成功基準 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-emerald-800">成功基準</h3>
            </div>
            <p className="text-emerald-700">{currentProblem.successCriteria}</p>
          </div>

          {/* テンプレート表示ボタン */}
          <div className="mb-6">
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <LightBulbIcon className="h-5 w-5 mr-2" />
              {showTemplate ? 'テンプレートを隠す' : '戦略的構成テンプレートを表示'}
            </button>
            
            {showTemplate && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-3">
                <h3 className="font-semibold text-purple-800 mb-2">戦略的構成テンプレート</h3>
                <pre className="text-purple-700 whitespace-pre-wrap text-sm">{currentProblem.template}</pre>
              </div>
            )}
          </div>

          {/* 回答入力 */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              戦略的な提案書・コミュニケーション案を作成してください
            </label>
            <textarea
              id="answer"
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="複雑な状況と多様なステークホルダーを考慮した、戦略的で説得力のある提案を作成してください..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-purple-800">フェーズ3完了！おめでとうございます！</h3>
                <p className="text-purple-700 mt-1">
                  全ての学習フェーズを修了されました。戦略的コミュニケーション能力が格段に向上しています。
                  <Link href="/report" className="text-purple-600 hover:text-purple-800 underline ml-2">
                    学習成果レポートを見る
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