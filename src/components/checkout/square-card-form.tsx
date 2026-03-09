"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<any>;
    };
  }
}

interface SquareCardFormProps {
  onCardTokenized: (token: string) => void;
  onError: (error: string) => void;
  isVisible: boolean;
}

export function SquareCardForm({ onCardTokenized, onError, isVisible }: SquareCardFormProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let mounted = true;

    const loadSquareScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Square) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="square"]');
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          return;
        }

        const script = document.createElement("script");
        script.src = "https://web.squarecdn.com/v1/square.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Square SDK の読み込みに失敗しました"));
        document.head.appendChild(script);
      });
    };

    const initializeCard = async () => {
      try {
        await loadSquareScript();

        if (!mounted || !window.Square) return;

        // Get Square config
        const configRes = await fetch("/api/payment/config");
        const config = await configRes.json();

        if (!config.applicationId || !config.locationId) {
          throw new Error("Square設定が見つかりません");
        }

        const payments = await window.Square.payments(config.applicationId, config.locationId);

        // Destroy existing card if any
        if (cardRef.current) {
          await cardRef.current.destroy();
          cardRef.current = null;
        }

        const card = await payments.card({
          postalCode: false,
        });

        if (mounted && cardContainerRef.current) {
          await card.attach(cardContainerRef.current);
          cardRef.current = card;
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Square initialization error:", error);
        if (mounted) {
          onError(error instanceof Error ? error.message : "カード入力の初期化に失敗しました");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeCard();

    return () => {
      mounted = false;
      if (cardRef.current) {
        cardRef.current.destroy().catch(console.error);
        cardRef.current = null;
      }
    };
  }, [isVisible, onError]);

  const tokenize = async (): Promise<string | null> => {
    if (!cardRef.current) {
      onError("カード情報が入力されていません");
      return null;
    }

    try {
      const result = await cardRef.current.tokenize();

      if (result.status === "OK") {
        return result.token;
      } else {
        const errorMessage = result.errors?.[0]?.message || "カード情報の検証に失敗しました";
        onError(errorMessage);
        return null;
      }
    } catch (error) {
      console.error("Tokenization error:", error);
      onError("カード情報の処理中にエラーが発生しました");
      return null;
    }
  };

  // Expose tokenize method via ref-like pattern
  useEffect(() => {
    if (isInitialized) {
      onCardTokenized("__READY__");
    }
  }, [isInitialized, onCardTokenized]);

  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
      <p className="text-sm text-gray-600 mb-3">カード情報を入力してください</p>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyan-600 border-t-transparent"></div>
          <span className="ml-2 text-sm text-gray-500">読み込み中...</span>
        </div>
      )}

      <div
        ref={cardContainerRef}
        id="card-container"
        className={isLoading ? "hidden" : ""}
        style={{ minHeight: "89px" }}
      />

      <p className="text-xs text-gray-400 mt-3">
        カード情報は安全に暗号化されて処理されます
      </p>
    </div>
  );
}

// Export a function to get tokenize method
export function useSquareCard() {
  const cardFormRef = useRef<{ tokenize: () => Promise<string | null> } | null>(null);

  const setTokenizeMethod = (method: () => Promise<string | null>) => {
    cardFormRef.current = { tokenize: method };
  };

  const tokenize = async () => {
    if (cardFormRef.current) {
      return cardFormRef.current.tokenize();
    }
    return null;
  };

  return { setTokenizeMethod, tokenize };
}
