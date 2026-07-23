export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function normalizeExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

export function playCompletionSound() {
  const AudioContextClass = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
  gain.connect(context.destination);

  [659.25, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.09);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.09);
    oscillator.stop(context.currentTime + 0.28 + index * 0.09);
  });

  window.setTimeout(() => void context.close(), 700);
}
