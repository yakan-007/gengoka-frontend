'use client'

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChartBarIcon, LightBulbIcon, ExclamationCircleIcon, ArrowTrendingUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface UserAnswer {
  problemId: string;
  userText: string;
  feedback?: string;
  score?: number;
  timestamp: Date;
}

interface HabitAnalysis {
  category: string;
  description: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  examples: string[];
  advice: string;
}

interface ReportData {
  totalAnswers: number;
  averageScore: number;
  scoreImprovement: number;
  strengths: string[];
  habits: HabitAnalysis[];
  recommendations: string[];
  nextSteps: string[];
}

export default function Report() {
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 癖パターンの分析ロジック
  const analyzeHabits = (answers: UserAnswer[]): HabitAnalysis[] => {
    const habits: HabitAnalysis[] = [];

    // 文章の長さ分析
    const lengths = answers.map(a => a.userText.length);
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    
    if (avgLength < 200) {
      habits.push({
        category: '文章の簡潔性',
        description: '文章が短すぎる傾向があります',
        frequency: lengths.filter(len => len < 200).length / lengths.length,
        severity: 'medium',
        examples: ['詳細な説明不足', '背景情報の省略'],
        advice: 'より具体的で詳細な説明を心がけ、相手が理解しやすい情報量を提供しましょう。'
      });
    } else if (avgLength > 800) {
      habits.push({
        category: '文章の冗長性',
        description: '文章が長すぎて要点が不明確になる傾向があります',
        frequency: lengths.filter(len => len > 800).length / lengths.length,
        severity: 'medium',
        examples: ['重要な情報が埋もれる', '読み手の負担増加'],
        advice: '要点を整理し、必要な情報のみを簡潔に伝える練習をしましょう。'
      });
    }

    // 構造化の分析
    const structuredCount = answers.filter(a => 
      a.userText.includes('■') || 
      a.userText.includes('・') || 
      a.userText.includes('【') ||
      a.userText.includes('1.') ||
      a.userText.includes('（')
    ).length;

    if (structuredCount / answers.length < 0.3) {
      habits.push({
        category: '構造化',
        description: '情報の整理・構造化が不十分な傾向があります',
        frequency: 1 - (structuredCount / answers.length),
        severity: 'high',
        examples: ['箇条書きの不使用', '段落分けの不備'],
        advice: '箇条書きや見出しを活用して、情報を整理して伝える習慣をつけましょう。'
      });
    }

    // 敬語・丁寧語の使用分析
    const politeCount = answers.filter(a => 
      a.userText.includes('ます') || 
      a.userText.includes('です') ||
      a.userText.includes('いたします') ||
      a.userText.includes('ございます')
    ).length;

    if (politeCount / answers.length < 0.5) {
      habits.push({
        category: '敬語・丁寧語',
        description: 'ビジネス文書として適切な敬語使用が不足している傾向があります',
        frequency: 1 - (politeCount / answers.length),
        severity: 'medium',
        examples: ['敬語の不使用', 'カジュアルな表現'],
        advice: 'ビジネスシーンに適した丁寧な表現を使用する習慣をつけましょう。'
      });
    }

    // スコア推移の分析
    const scores = answers.filter(a => a.score).map(a => a.score!);
    if (scores.length > 3) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
      
      if (secondAvg - firstAvg < 5) {
        habits.push({
          category: '学習効果',
          description: 'スコアの向上が緩やかで、学習効果が限定的な可能性があります',
          frequency: 1,
          severity: 'low',
          examples: ['同じ間違いの繰り返し', '新しい表現の未習得'],
          advice: 'フィードバックを振り返り、具体的な改善点を意識して練習しましょう。'
        });
      }
    }

    return habits;
  };

  // 強みの分析
  const analyzeStrengths = (answers: UserAnswer[]): string[] => {
    const strengths: string[] = [];
    const scores = answers.filter(a => a.score).map(a => a.score!);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    if (avgScore >= 85) {
      strengths.push('高い文章品質を維持している');
    }
    if (avgScore >= 80) {
      strengths.push('ビジネス文書の基本構造を理解している');
    }

    const structuredCount = answers.filter(a => 
      a.userText.includes('■') || a.userText.includes('・') || a.userText.includes('【')
    ).length;
    
    if (structuredCount / answers.length > 0.7) {
      strengths.push('情報の構造化が得意');
    }

    const detailCount = answers.filter(a => a.userText.length > 300).length;
    if (detailCount / answers.length > 0.6) {
      strengths.push('詳細で丁寧な説明ができる');
    }

    if (strengths.length === 0) {
      strengths.push('学習に積極的に取り組んでいる');
    }

    return strengths;
  };

  // 推奨事項の生成
  const generateRecommendations = (habits: HabitAnalysis[], avgScore: number): string[] => {
    const recommendations: string[] = [];

    if (avgScore < 70) {
      recommendations.push('基本的なビジネス文書の型をもう一度復習しましょう');
    }
    if (avgScore < 80) {
      recommendations.push('テンプレートを活用して構造化された文章作成を練習しましょう');
    }

    habits.forEach(habit => {
      if (habit.severity === 'high') {
        recommendations.push(`${habit.category}の改善を最優先で取り組みましょう`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('現在のレベルを維持しながら、より高度な表現を学習しましょう');
    }

    return recommendations;
  };

  useEffect(() => {
    // ローカルストレージから回答データを読み込み
    const savedAnswers = localStorage.getItem('gengoka-answers');
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers).map((answer: UserAnswer) => ({
        ...answer,
        timestamp: new Date(answer.timestamp)
      }));
      
      setAnswers(parsedAnswers);

      if (parsedAnswers.length > 0) {
        // レポート生成
        const habits = analyzeHabits(parsedAnswers);
        const strengths = analyzeStrengths(parsedAnswers);
        const scores = parsedAnswers.filter((a: UserAnswer) => a.score).map((a: UserAnswer) => a.score!);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length) : 0;
        
        // スコア改善度の計算
        let scoreImprovement = 0;
        if (scores.length > 3) {
          const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
          const secondHalf = scores.slice(Math.floor(scores.length / 2));
          const firstAvg = firstHalf.reduce((sum: number, score: number) => sum + score, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum: number, score: number) => sum + score, 0) / secondHalf.length;
          scoreImprovement = Math.round(secondAvg - firstAvg);
        }

        const recommendations = generateRecommendations(habits, avgScore);
        
        const nextSteps = [
          '継続的な学習と実践',
          'フィードバックの振り返り',
          '実際の業務での応用',
          '他の人からの意見収集'
        ];

        setReport({
          totalAnswers: parsedAnswers.length,
          averageScore: avgScore,
          scoreImprovement,
          strengths,
          habits,
          recommendations,
          nextSteps
        });
      }
    }
  }, []);

  const generateDetailedReport = async () => {
    if (!answers.length) return;
    
    setIsGenerating(true);
    // 実際のAI分析（現在はシンプルな分析で代替）
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  if (answers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  ホームに戻る
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">言語化の癖レポート</h1>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">分析データが不足しています</h3>
          <p className="text-gray-600 mb-6">
            レポートを生成するには、少なくとも3つの問題に回答してAI添削を受ける必要があります。
          </p>
          <Link
            href="/phase/1"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            学習を始める
          </Link>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">言語化の癖レポート</h1>
            </div>
            <button
              onClick={generateDetailedReport}
              disabled={isGenerating}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
            >
              {isGenerating ? '分析中...' : '詳細分析'}
            </button>
          </div>
        </div>
      </header>

      {report && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{report.totalAnswers}</div>
              <div className="text-sm text-gray-600">総回答数</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{report.averageScore}</div>
              <div className="text-sm text-gray-600">平均スコア</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {report.scoreImprovement > 0 ? `+${report.scoreImprovement}` : report.scoreImprovement}
              </div>
              <div className="text-sm text-gray-600">スコア改善度</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ExclamationCircleIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{report.habits.length}</div>
              <div className="text-sm text-gray-600">改善ポイント</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 強み */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">あなたの強み</h3>
              </div>
              <div className="space-y-3">
                {report.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 推奨事項 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">推奨事項</h3>
              </div>
              <div className="space-y-3">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 言語化の癖分析 */}
          {report.habits.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">言語化の癖分析</h3>
              <div className="space-y-6">
                {report.habits.map((habit, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{habit.category}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(habit.severity)}`}>
                        優先度：{getSeverityText(habit.severity)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{habit.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>発生頻度</span>
                        <span>{Math.round(habit.frequency * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${habit.frequency * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">具体例</h5>
                      <div className="flex flex-wrap gap-2">
                        {habit.examples.map((example, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">改善アドバイス</h5>
                      <p className="text-blue-800 text-sm">{habit.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 次のステップ */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">次のステップ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 継続学習の案内 */}
          <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">継続的な学習で更なる向上を</h3>
            <p className="mb-4">定期的な練習とフィードバックの確認で、コミュニケーション能力を向上させましょう。</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/phase/1"
                className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                復習する
              </Link>
              <Link
                href="/history"
                className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-indigo-600 transition-colors"
              >
                履歴を見る
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 