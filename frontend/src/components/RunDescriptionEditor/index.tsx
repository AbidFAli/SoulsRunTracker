"use client"
import type { Delta, Op, Range } from 'quill';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import "./styles.module.scss";


// Editor is an uncontrolled React component
export interface RunDescriptionEditorProps{
  ref: React.RefObject<Quill | null>;
  defaultValue?: Delta | Op[];
  readOnly?: boolean;
  onTextChange?: (delta: Delta) => void;
  onSelectionChange?: (range: Range) => void;
}

export default function RunDescriptionEditor({ref, defaultValue, readOnly, onTextChange, onSelectionChange}: RunDescriptionEditorProps){
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if(container){
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div'),
        );

        const quill = new Quill(editorContainer, {
          theme: 'snow',
          placeholder: 'Enter description',
        });

        ref.current = quill;

        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        }

        quill.on(Quill.events.TEXT_CHANGE, (delta) => {
          onTextChangeRef.current?.(delta);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (range) => {
          onSelectionChangeRef.current?.(range);
        });

      }


      return () => {
        ref.current = null;
        if(container){
          container.innerHTML = '';
        }
      };
    }, [ref]);

    return <div className="text-white" ref={containerRef}></div>;
}

