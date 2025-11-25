/**
 * 服务器端 GraphQL 客户端
 * 使用原生 fetch API，避免 Apollo Client 版本冲突
 */

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlFetch<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  // 在服務器端使用相對路徑，在客戶端使用完整 URL
  const url = typeof window === 'undefined'
    ? `http://localhost:${process.env.PORT || 3001}/api/graphql`
    : (process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // 禁用缓存，确保数据最新
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessage = result.errors[0].message;
    console.error("❌ GraphQL Error:", errorMessage);

    // 提供更友好的错误信息
    if (errorMessage.includes("Cannot read properties of undefined")) {
      throw new Error(
        "⚠️ 数据库未配置或连接失败！\n\n" +
        "请检查：\n" +
        "1. PostgreSQL 是否已启动\n" +
        "2. .env 文件中的 DATABASE_URL 是否正确\n" +
        "3. 是否已运行 'pnpm prisma migrate dev'\n\n" +
        "原始错误: " + errorMessage
      );
    }

    throw new Error(errorMessage);
  }

  if (!result.data) {
    throw new Error("No data returned from GraphQL query");
  }

  return result.data;
}

// 兼容原来的 getClient 接口
export const getClient = () => ({
  query: async <T = any>({ query, variables }: { query: any; variables?: any }) => {
    // 如果 query 是 DocumentNode，转换为字符串
    const queryString = typeof query === "string" ? query : query.loc?.source?.body || "";
    const data = await graphqlFetch<T>(queryString, variables);
    return { data };
  },
  mutate: async <T = any>({ mutation, variables }: { mutation: any; variables?: any }) => {
    const mutationString = typeof mutation === "string" ? mutation : mutation.loc?.source?.body || "";
    const data = await graphqlFetch<T>(mutationString, variables);
    return { data };
  },
});
