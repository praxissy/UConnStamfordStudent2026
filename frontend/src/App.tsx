import { Navigate, Route, Routes } from 'react-router-dom'
import {
  PortfolioPage, PublicDetailPage, PublicPreviewPage, SearchPage, SubmitPage,
} from '@/pages'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<SearchPage />} />
      <Route path="/item/:slug" element={<PublicDetailPage />} />

      {/* Student dashboard */}
      <Route path="/dashboard" element={<PortfolioPage />} />
      <Route path="/dashboard/new" element={<SubmitPage />} />
      <Route path="/dashboard/:id/edit" element={<SubmitPage />} />
      <Route path="/preview" element={<PublicPreviewPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
