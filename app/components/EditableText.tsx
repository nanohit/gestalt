'use client';

import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, Ref } from "react";
import styles from "../page.module.css";

type EditableTextProps = {
  tag?: keyof React.JSX.IntrinsicElements;
  value: string;
  canEdit: boolean;
  className?: string;
  onChange: (value: string) => void;
};

export function EditableText({
  tag = "span",
  value,
  canEdit,
  className,
  onChange,
}: EditableTextProps) {
  const Tag = tag;
  const [isEditing, setIsEditing] = useState(false);
  const [initialValue, setInitialValue] = useState(value);
  const elementRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef(false);
  const isEditingRef = useRef(isEditing);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && elementRef.current) {
      if (elementRef.current.innerText !== value) {
        elementRef.current.innerText = value;
      }
      setInitialValue(value);
    }
  }, [isEditing, value]);

  const enableEditing = useCallback(() => {
    if (!canEdit) return;
    setInitialValue(value);
    setIsEditing(true);
    cancelRef.current = false;
    requestAnimationFrame(() => {
      const element = elementRef.current;
      if (element) {
        element.focus({ preventScroll: true });
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  }, [canEdit, value]);

  const commitChanges = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    const nextValue = element.innerText.trim();
    onChange(nextValue);
    setIsEditing(false);
  }, [onChange]);

  const cancelChanges = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.innerText = initialValue;
    }
    cancelRef.current = true;
    setIsEditing(false);
  }, [initialValue]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!isEditing) return;
      if (event.key === "Enter") {
        event.preventDefault();
        commitChanges();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelChanges();
      }
    },
    [cancelChanges, commitChanges, isEditing],
  );

  const handleBlur = useCallback(() => {
    if (!isEditingRef.current) {
      cancelRef.current = false;
      return;
    }
    if (cancelRef.current) {
      cancelRef.current = false;
      return;
    }
    commitChanges();
  }, [commitChanges]);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      elementRef.current = element;
    },
    [value],
  );

  return createElement(
    Tag ?? "span",
    {
      ref: refCallback as unknown as Ref<any>,
      className: `${className ?? ""} ${canEdit ? styles.editable : ""} ${
        isEditing ? styles.editing : ""
      }`,
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      onClick: enableEditing,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      role: canEdit ? "textbox" : undefined,
      "aria-label": canEdit ? "Редактируемый текст" : undefined,
      tabIndex: canEdit ? 0 : undefined,
    },
    value,
  );
}

export default EditableText;
