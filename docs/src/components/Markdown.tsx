import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-cyan max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-5xl font-bold text-white drop-shadow-md mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-4xl font-bold text-white drop-shadow-md mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-3xl font-bold text-white drop-shadow-md mb-3 mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-2xl font-bold text-white drop-shadow-md mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 text-lg mb-4 space-y-2 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 text-lg mb-4 space-y-2 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 text-lg">{children}</li>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-black/30 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm border border-cyan-500/20">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="mb-4">{children}</pre>,
          a: ({ children, href }) => (
            <a
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-500/40 pl-4 italic text-gray-300 mb-4">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-cyan-500/20 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
