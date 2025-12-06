#!/bin/bash

set -e

cd /var/www/ROC

echo ">>> 停止伺服器..."
pm2 stop roc

echo ">>> 刪除 .next 目錄..."
rm -rf .next

echo ">>> 重新 build..."
pnpm build

echo ">>> 啟動伺服器..."
pm2 start roc

echo ">>> 完成！"
pm2 status
