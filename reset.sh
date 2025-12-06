#!/bin/bash

echo "🛑 Killing stuck Expo/Node processes..."
killall -9 node 2>/dev/null
killall -9 watchman 2>/dev/null
killall -9 expo 2>/dev/null
killall -9 metro 2>/dev/null

echo "🧹 Cleaning Expo & Metro cache..."
rm -rf .expo
rm -rf .expo-shared
rm -rf .turbo
rm -rf .cache

echo "🔧 Cleaning lock files..."
rm -f package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting Expo with clean cache..."
npx expo start --clear
