import { gql } from "@apollo/client";

export const CREATE_SAMPLE_LETTER = gql`
  mutation CreateSampleLetter($title: String!, $content: String!) {
    createSampleLetter(title: $title, content: $content) {
      title
    }
  }
`;

export const PREVIEW_HTML = gql`
  mutation PreviewHtml($markers: [MarkerInput!]!, $sampleLetterId: ID!) {
    previewHtml(markers: $markers, id: $sampleLetterId)
  }
`;

export const GENERATE_PDF = gql`
  mutation GeneratePdf($markers: [MarkerInput!]!, $generatePdfId: ID!) {
    generatePdf(markers: $markers, id: $generatePdfId)
  }
`;
