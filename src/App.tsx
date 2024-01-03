import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// queryClientの初期設定を作成
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        }
    }
})

// アロー関数に書き換え
const App: FC = () => {
    return (
        <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 text-sm font-bold">
            {/* react-queryを使用する為にqueryClientProviderでラップする */}
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                </BrowserRouter>
                {/* ReactQueryDevtoolsを使用する */}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </div>
    );
}

export default App;
