import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import './MarkdownMessage.css';

export const MarkdownMessage = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
                p: ({ children }) => <p>{children}</p>,
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                code({
                    inline,
                    className,
                    children,
                    ...props
                }: React.ComponentProps<'code'> & { inline?: boolean }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <><div style={{ position: "relative" }}>
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                                className="rounded-lg"
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                            <button
                                className="copy-button"
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    zIndex: 2
                                }}
                                onClick={() => {
                                    navigator.clipboard.writeText(String(children));
                                }}
                            >
                                <img src="./images/copy-code.svg" alt="Copy" className="copy-code" />
                            </button>
                        </div></>
                    ) : (
                        <code className="code">{children}</code>

                    );
                },
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                    />
                )
            }}
        />
    );
};
