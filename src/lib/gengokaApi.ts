export async function testGemini(): Promise<string> {
  const res = await fetch('http://localhost:8000/test-gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Gemini APIテストに失敗しました');
  }
  const data = await res.json();
  return data.response;
} 