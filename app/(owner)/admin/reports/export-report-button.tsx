'use client'

import { useState } from 'react'
import { Download, Loader2, FileText, File } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ExportReportButtonProps {
  totalInvested: number
  totalExpectedROI: number
  totalActualROI: number
  activeInvestments: number
  completedInvestments: number
  pendingInvestments: number
  totalInvestors: number
  approvedKYC: number
  pendingKYC: number
  monthlyData: [string, { invested: number; count: number }][]
}

export function ExportReportButton({
  totalInvested,
  totalExpectedROI,
  totalActualROI,
  activeInvestments,
  completedInvestments,
  pendingInvestments,
  totalInvestors,
  approvedKYC,
  pendingKYC,
  monthlyData,
}: ExportReportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const exportCSV = () => {
    setIsExporting(true)
    setShowModal(false)

    // Create CSV content
    const csvContent = [
      ['Agro Invest Platform Report'],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [''],
      ['Key Metrics'],
      ['Metric', 'Value'],
      ['Total Investors', totalInvestors],
      ['Total Invested', totalInvested],
      ['Expected ROI', totalExpectedROI],
      ['Actual ROI Paid', totalActualROI],
      [''],
      ['Investment Status'],
      ['Status', 'Count'],
      ['Active', activeInvestments],
      ['Completed', completedInvestments],
      ['Pending', pendingInvestments],
      [''],
      ['KYC Verification'],
      ['Status', 'Count'],
      ['Approved', approvedKYC],
      ['Pending Review', pendingKYC],
      [''],
      ['Monthly Investment Trend'],
      ['Month', 'Investments Count', 'Total Invested'],
      ...monthlyData.map(([month, data]) => [month, data.count, data.invested]),
    ]
      .map(row => row.join(','))
      .join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `agro-invest-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  const exportPDF = () => {
    setIsExporting(true)
    setShowModal(false)

    // Create simple HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agro Invest Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #22c55e; }
          .metric { margin: 10px 0; }
          .section { margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #1e293b; color: white; }
        </style>
      </head>
      <body>
        <h1>Agro Invest Platform Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        
        <div class="section">
          <h2>Key Metrics</h2>
          <div class="metric"><strong>Total Investors:</strong> ${totalInvestors}</div>
          <div class="metric"><strong>Total Invested:</strong> ${totalInvested}</div>
          <div class="metric"><strong>Expected ROI:</strong> ${totalExpectedROI}</div>
          <div class="metric"><strong>Actual ROI Paid:</strong> ${totalActualROI}</div>
        </div>

        <div class="section">
          <h2>Investment Status</h2>
          <table>
            <tr><th>Status</th><th>Count</th></tr>
            <tr><td>Active</td><td>${activeInvestments}</td></tr>
            <tr><td>Completed</td><td>${completedInvestments}</td></tr>
            <tr><td>Pending</td><td>${pendingInvestments}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>KYC Verification</h2>
          <table>
            <tr><th>Status</th><th>Count</th></tr>
            <tr><td>Approved</td><td>${approvedKYC}</td></tr>
            <tr><td>Pending Review</td><td>${pendingKYC}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Monthly Investment Trend</h2>
          <table>
            <tr><th>Month</th><th>Investments Count</th><th>Total Invested</th></tr>
            ${monthlyData.map(([month, data]) => `<tr><td>${month}</td><td>${data.count}</td><td>${data.invested}</td></tr>`).join('')}
          </table>
        </div>
      </body>
      </html>
    `

    // Create and download HTML file (can be printed to PDF)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `agro-invest-report-${new Date().toISOString().split('T')[0]}.html`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isExporting}
        className="btn-secondary flex items-center gap-2"
      >
        {isExporting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</>
        ) : (
          <><Download className="h-4 w-4" /> Export Report</>
        )}
      </button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription className="text-slate-400">
              Choose the format you want to export the report in
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={exportCSV}
              variant="outline"
              className="flex flex-col items-center gap-3 h-32 border-slate-700 hover:bg-slate-800"
            >
              <FileText className="h-8 w-8 text-green-400" />
              <div className="text-center">
                <div className="font-medium">CSV</div>
                <div className="text-xs text-slate-400">Spreadsheet format</div>
              </div>
            </Button>
            <Button
              onClick={exportPDF}
              variant="outline"
              className="flex flex-col items-center gap-3 h-32 border-slate-700 hover:bg-slate-800"
            >
              <File className="h-8 w-8 text-blue-400" />
              <div className="text-center">
                <div className="font-medium">HTML/PDF</div>
                <div className="text-xs text-slate-400">Printable format</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
