'use client'

import { useState, useEffect } from 'react';
import { BookOpenIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { testGemini } from '@/lib/gengokaApi';

interface LearningProgress {
  phase1: number;
  phase2: number;
  phase3: number;
}

export default function Home() {
  const [progress, setProgress] = useState<LearningProgress>({ phase1: 0, phase2: 0, phase3: 0 });
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loadingGemini, setLoadingGemini] = useState(false);

  useEffect(() => {
    // ローカルストレージから進捗を読み込み
    const savedProgress = localStorage.getItem('gengoka-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Gengoka</h1>
              <span className="ml-2 text-sm text-gray-500">言語化トレーニング</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/history" className="text-gray-600 hover:text-gray-900 transition-colors">
                学習履歴
              </Link>
              <Link href="/report" className="text-gray-600 hover:text-gray-900 transition-colors">
                癖レポート
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            あなたの言葉が、<br />
            意図通りに相手を動かす力を持つ
          </h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-3xl mx-auto">
            AIによる実践的な練習とパーソナルなフィードバックを通じて、
            「指示力」「説明力」「交渉力」を含む総合的なビジネスコミュニケーション能力を向上させましょう。
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/phase/1" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              今すぐ始める
            </Link>
            <Link 
              href="/about" 
              className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              詳しく見る
            </Link>
          </div>
        </div>
      </section>

      {/* 学習フェーズ紹介 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">3つの学習フェーズ</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              段階的に学習することで、確実にビジネスコミュニケーション能力を向上させます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* フェーズ1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <BookOpenIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h4 className="text-xl font-bold text-gray-900">フェーズ1</h4>
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-2">基礎の確立と「型」の習得</h5>
              <p className="text-gray-600 mb-4">
                「悪い例」の添削、テンプレート埋め込みを通じて、ビジネス文書の基本的な型を身につけます。
              </p>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress.phase1}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{progress.phase1}%</span>
              </div>
              <div className="mt-4">
                <Link 
                  href="/phase/1" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  開始する
                </Link>
              </div>
            </div>

            {/* フェーズ2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <PencilSquareIcon className="h-8 w-8 text-green-600 mr-3" />
                <h4 className="text-xl font-bold text-gray-900">フェーズ2</h4>
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-2">実践的な構成力と「伝わる指示」の強化</h5>
              <p className="text-gray-600 mb-4">
                ケーススタディ作成、目的達成を目指した指示文の最適化で実践力を磨きます。
              </p>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress.phase2}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{progress.phase2}%</span>
              </div>
              <div className="mt-4">
                <Link 
                  href="/phase/2" 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
                >
                  開始する
                </Link>
              </div>
            </div>

            {/* フェーズ3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mr-3" />
                <h4 className="text-xl font-bold text-gray-900">フェーズ3</h4>
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-2">戦略的コミュニケーションと総合力の発揮</h5>
              <p className="text-gray-600 mb-4">
                図表説明、複雑なケース作成で、上級者レベルのコミュニケーション能力を習得します。
              </p>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress.phase3}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{progress.phase3}%</span>
              </div>
              <div className="mt-4">
                <Link 
                  href="/phase/3" 
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
                >
                  開始する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Gengokaの特徴</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI添削</h4>
              <p className="text-gray-600">
                Google Geminiによる詳細で的確なフィードバック
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">段階的学習</h4>
              <p className="text-gray-600">
                3つのフェーズで確実にスキルアップ
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PencilSquareIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">個別分析</h4>
              <p className="text-gray-600">
                あなたの「言語化の癖」を特定・改善
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">実践的</h4>
              <p className="text-gray-600">
                実際のビジネスシーンで使える内容
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              onClick={async () => {
                setLoadingGemini(true);
                setGeminiResult(null);
                try {
                  const result = await testGemini();
                  setGeminiResult(result);
                } catch (e) {
                  setGeminiResult('エラーが発生しました');
                } finally {
                  setLoadingGemini(false);
                }
              }}
              disabled={loadingGemini}
            >
              {loadingGemini ? 'AIテスト中...' : 'Gemini APIテスト'}
            </button>
            {geminiResult && (
              <div className="mt-4 p-4 bg-white rounded shadow text-left max-w-2xl mx-auto">
                <div className="font-bold mb-2">Gemini API応答:</div>
                <pre className="whitespace-pre-wrap text-gray-800">{geminiResult}</pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">Gengoka</h5>
              <p className="text-gray-400">
                言語化スキルの向上を通じて、ビジネスコミュニケーション能力を高めるアプリケーションです。
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">学習コンテンツ</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/phase/1" className="hover:text-white transition-colors">フェーズ1: 基礎</Link></li>
                <li><Link href="/phase/2" className="hover:text-white transition-colors">フェーズ2: 実践</Link></li>
                <li><Link href="/phase/3" className="hover:text-white transition-colors">フェーズ3: 応用</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">機能</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/history" className="hover:text-white transition-colors">学習履歴</Link></li>
                <li><Link href="/report" className="hover:text-white transition-colors">癖レポート</Link></li>
                <li><Link href="/export" className="hover:text-white transition-colors">データエクスポート</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gengoka. すべての学習データはブラウザのローカルストレージに保存されます。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
