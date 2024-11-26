#!/bin/bash

# 从.env.local加载环境变量
export $(cat .env.local | xargs)

# 运行更新脚本
ts-node -T update_translations.ts
