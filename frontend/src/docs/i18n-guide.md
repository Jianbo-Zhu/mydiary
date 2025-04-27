# 国际化(i18n)使用指南

本项目使用 `next-intl` 库实现国际化，以下是使用方法和最佳实践。

## 基本用法

### 在组件中使用翻译

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  // 获取翻译函数，可以指定命名空间
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('appName')}</h1>
      <p>{t('welcomeMessage')}</p>
    </div>
  );
}
```

### 格式化日期和数字

```tsx
import { useFormatter } from 'next-intl';

function FormattedContent() {
  const format = useFormatter();
  
  return (
    <div>
      <p>
        {format.dateTime(new Date(), {
          dateStyle: 'full',
          timeStyle: 'short'
        })}
      </p>
      <p>
        {format.number(1000000, {
          style: 'currency',
          currency: 'CNY'
        })}
      </p>
    </div>
  );
}
```

## 添加新的语言

1. 在 `src/locales` 目录创建新的语言文件，例如 `ja.json`
2. 更新 `src/utils/i18n.ts` 中的 `locales` 数组添加新语言
3. 确保所有语言文件中的键保持一致

## 页面的国际化

对于静态生成的页面，使用 `getStaticProps`：

```tsx
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await getMessages(locale || 'en');
  
  return {
    props: {
      messages,
    },
  };
};
```

对于服务端渲染的页面，使用 `getServerSideProps`：

```tsx
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const messages = await getMessages(locale || 'en');
  
  return {
    props: {
      messages,
    },
  };
};
```

## 语言切换

使用 `LanguageSwitcher` 组件允许用户在不同语言之间切换。这个组件已经集成在布局中，但也可以单独使用：

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

function MyPage() {
  return (
    <div>
      <LanguageSwitcher />
      {/* 其他内容 */}
    </div>
  );
}
```

## 添加新的文本

当需要添加新的文本时，先在所有语言文件中添加相应的键值对，以保持一致性。例如，要添加一个"提交"按钮的文本：

1. 在 `en.json` 添加 `"submit": "Submit"`
2. 在 `zh-CN.json` 添加 `"submit": "提交"`
3. 在任何其他语言文件中添加相应的翻译

## 最佳实践

1. 使用嵌套命名空间组织文本，例如 `common.button.submit`
2. 避免在翻译文件中包含HTML标记
3. 对于大型文本块，考虑使用 Markdown 或 HTML 组件
4. 定期检查所有语言文件的完整性，确保没有缺失的翻译键 