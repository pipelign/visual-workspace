import type { ReactNode } from 'react';

export interface Dimensions {
  width: number;
  height: number;
}
export interface Diagnostic {
  code: string;
  item: string;
  source: string;
  field: string;
  message: string;
  repair: string;
}
export class StudioError extends Error {
  readonly diagnostic: Diagnostic;
  constructor(diagnostic: Diagnostic, cause?: unknown) {
    super(diagnostic.message, { cause });
    this.name = 'StudioError';
    this.diagnostic = diagnostic;
  }
}
export interface Artifact {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  usage: string;
  lifecycle: 'draft';
  project: string;
  brief: string;
  brand: string;
  source: string;
  dimensions: Dimensions;
  capabilities: ['html'];
  tokens: string[];
  assets: Record<string, string>;
}
export interface Brand {
  id: string;
  roles: Record<string, { kind: 'color' | 'font'; description: string }>;
  variations: Record<string, Record<string, string>>;
  fonts: Record<string, { source: string; license: string }>;
}
export interface RenderInputs {
  dimensions: Dimensions;
  tokens: Readonly<Record<string, string>>;
  assets: Readonly<Record<string, string>>;
}
export type Composition = (inputs: RenderInputs) => ReactNode;
export interface SourceState {
  revision: string | null;
  dirty: boolean | null;
  files: { path: string; sha256: string }[];
  digest: string;
}
export interface ExportRecord {
  id: string;
  variation: string;
  brand: string;
  format: 'html';
  dimensions: Dimensions;
  source: SourceState;
  renderer: {
    name: 'react-static';
    react: string;
    node: string;
    packaging: 'single-file';
  };
}
export interface RenderedArtifact {
  html: string;
  record: ExportRecord;
}
export interface Inspection extends Artifact {
  variations: string[];
  diagnostics: Diagnostic[];
}
export interface RenderRequest {
  id: string;
  variation: string;
}
export interface ExportRequest extends RenderRequest {
  format: string;
  output: string;
}
