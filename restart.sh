#!/bin/bash

set -e

cd /var/www/ROC

echo ">>> 停止伺服器..."
pm2 stop roc || true

echo ">>> 清理記憶體..."
sync
echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null 2>&1 || true

echo ">>> 刪除 .next 目錄..."
rm -rf .next

echo ">>> 重新 build (限制記憶體使用)..."
NODE_OPTIONS="--max-old-space-size=1024" pnpm build

echo ">>> 啟動伺服器..."
pm2 start roc

echo ">>> 完成！"
pm2 status
