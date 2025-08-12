import React, { useState } from "react";
import "./TemplateForm.css";

export function TemplateForm({ onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        category: "",
        details: "",
        goal: "",
        questions: "",
        endgoal: "",
        firstQuestion: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    }

    return (
        <div className="template-form-container">
            <form onSubmit={handleSubmit} className="template-form-card">
                <h2 className="template-form-title">
                    Build Your Custom AI Assistant
                </h2>
                <p className="details">
                    Fill in the details below to create an assistant tailored to your company’s needs.
                </p>
                <label className="template-form-label">
                    Company Name:
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="template-form-input" />
                </label>
                <label className="template-form-label">
                    Company Category:
                    <input type="text" name="category" value={form.category} onChange={handleChange} required className="template-form-input" />
                </label>
                <label className="template-form-label">
                    What does your Company do?
                    <textarea name="details" value={form.details} onChange={handleChange} required className="template-form-textarea" />
                </label>
                <label className="template-form-label">
                    What do you want the Assistant to help you with?
                    <textarea name="goal" value={form.goal} onChange={handleChange} required className="template-form-textarea" />
                </label>
                <label className="template-form-label">
                    Do you have any questions for the Assistant to ask? (comma separated):
                    <textarea name="questions" value={form.questions} onChange={handleChange} required className="template-form-textarea" />
                </label>
                <label className="template-form-label">
                    What do you want the Assistant to do at the end of the conversation?
                    <textarea name="endgoal" value={form.endgoal} onChange={handleChange} required className="template-form-textarea" />
                </label>
                <label className="template-form-label">
                    How do you want the conversation to begin with?
                    <input type="text" name="firstQuestion" value={form.firstQuestion} onChange={handleChange} required className="template-form-input" />
                </label>
                <button type="submit" className="template-form-button">Create Your Assistant</button>
            </form>
        </div>
    );
}