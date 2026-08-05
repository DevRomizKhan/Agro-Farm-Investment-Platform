'use client'

import { useState } from 'react'
import { Download, File, FileText, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { COMPANY_INFO } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  totalSharesSold: number
  availableSharesForSale: number
  totalOwnerShares: number
  totalInvestorShares: number
  activeSubscribers: number
  contactRequests: number
  openContacts: number
  totalSubmissions: number
}

const today = () => new Date().toISOString().split('T')[0]
const number = (value: number) => value.toLocaleString()
const csvValue = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`

const renderFarmAddressLine = async (address: string) => {
  const font = new FontFace('AmanahBengali', "url('/fonts/NotoSansBengali-Regular.ttf')")
  await font.load()
  document.fonts.add(font)

  const scale = 4
  const label = 'Farm address'
  const labelFont = `bold ${5 * scale}px Arial`
  const addressFont = `${8 * scale}px AmanahBengali`
  const measureCanvas = document.createElement('canvas')
  const measureContext = measureCanvas.getContext('2d')
  if (!measureContext) throw new Error('Could not prepare address renderer')
  measureContext.font = labelFont
  const labelWidth = measureContext.measureText(label).width
  measureContext.font = addressFont
  const addressWidth = measureContext.measureText(address).width

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(labelWidth + addressWidth + 32)
  canvas.height = 60
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not render farm address')
  context.textBaseline = 'alphabetic'
  context.font = labelFont
  context.fillStyle = '#bedcca'
  context.fillText(label, 8, 40)
  context.font = addressFont
  context.fillStyle = '#d7eee0'
  context.fillText(address, labelWidth + 18, 40)

  return {
    data: canvas.toDataURL('image/png'),
    width: canvas.width * 0.264583 / scale,
    height: canvas.height * 0.264583 / scale,
  }
}

export function ExportReportButton(props: ExportReportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const download = (content: BlobPart, type: string, filename: string) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(new Blob([content], { type }))
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    setIsExporting(true)
    setShowModal(false)
    const rows: (string | number)[][] = [
      ['Amanah Farm Report'],
      [`Farm address: ${COMPANY_INFO.farmLocations}`],
      [`Issued by: ${COMPANY_INFO.founder} (${COMPANY_INFO.founderTitle})`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [''],
      ['Key Metrics'], ['Metric', 'Value'],
      ['Total Investors', props.totalInvestors], ['Total Invested', props.totalInvested],
      ['Expected ROI', props.totalExpectedROI], ['Actual ROI Paid', props.totalActualROI],
      [''], ['Audience & Contact Overview'], ['Metric', 'Value'],
      ['Active Subscribers', props.activeSubscribers], ['Contact Requests', props.contactRequests],
      ['Open Enquiries', props.openContacts], ['Total Submissions', props.totalSubmissions],
      [''], ['Share Allocation'], ['Metric', 'Value'],
      ['Total Owner Shares', props.totalOwnerShares], ['Total Investor Shares', props.totalInvestorShares],
      ['Shares Sold', props.totalSharesSold], ['Available Shares', props.availableSharesForSale],
      [''], ['Investment Status'], ['Status', 'Count'],
      ['Active', props.activeInvestments], ['Completed', props.completedInvestments], ['Pending', props.pendingInvestments],
      [''], ['KYC Verification'], ['Status', 'Count'],
      ['Approved', props.approvedKYC], ['Pending Review', props.pendingKYC],
      [''], ['Monthly Investment Trend'], ['Month', 'Investments Count', 'Total Invested'],
      ...props.monthlyData.map(([month, data]) => [month, data.count, data.invested]),
    ]
    const csv = rows.map((row) => row.map(csvValue).join(',')).join('\n')
    download(csv, 'text/csv;charset=utf-8;', `Amanah Farm Report-${today()}.csv`)
    setIsExporting(false)
  }

  const exportPDF = async () => {
    setIsExporting(true)
    setShowModal(false)
    const doc = new jsPDF()
    const farmAddress = await renderFarmAddressLine(COMPANY_INFO.farmLocations)
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 18
    let y = 18

    const footer = () => {
      const pages = doc.getNumberOfPages()
      for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page)
        doc.setDrawColor(210, 220, 215)
        doc.line(margin, pageHeight - 17, pageWidth - margin, pageHeight - 17)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(100, 115, 108)
        doc.text('Amanah Farm  •  Confidential owner report  •  Issued by Kazi Shakib', margin, pageHeight - 10)
        doc.text(`Page ${page} of ${pages}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
      }
    }

    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - 25) {
        doc.addPage()
        y = 20
      }
    }

    const section = (title: string) => {
      ensureSpace(14)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(25, 75, 50)
      doc.text(title, margin, y)
      doc.setDrawColor(35, 155, 90)
      doc.setLineWidth(0.7)
      doc.line(margin, y + 3, pageWidth - margin, y + 3)
      y += 11
    }

    const metrics = (items: [string, string][]) => {
      const boxWidth = (pageWidth - margin * 2) / 2 - 3
      const rows = Math.ceil(items.length / 2)
      ensureSpace(rows * 18)
      items.forEach(([label, value], index) => {
        const x = margin + (index % 2) * (boxWidth + 6)
        const boxY = y + Math.floor(index / 2) * 18 - 5
        doc.setFillColor(246, 249, 247)
        doc.roundedRect(x, boxY, boxWidth, 13, 2, 2, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(100, 115, 108)
        doc.text(label, x + 4, boxY + 5)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(25, 45, 35)
        doc.text(value, x + 4, boxY + 10)
      })
      y += rows * 18
    }

    const table = (headers: string[], rows: (string | number)[][]) => {
      const columnWidth = (pageWidth - margin * 2) / headers.length
      ensureSpace(14 + rows.length * 8)
      doc.setFillColor(25, 75, 50)
      doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      headers.forEach((header, index) => doc.text(header, margin + index * columnWidth + 3, y))
      y += 8
      rows.forEach((row, index) => {
        ensureSpace(8)
        if (index % 2 === 0) {
          doc.setFillColor(246, 249, 247)
          doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F')
        }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(45, 60, 50)
        row.forEach((value, column) => doc.text(String(value), margin + column * columnWidth + 3, y))
        y += 8
      })
      y += 5
    }

    doc.setFillColor(25, 75, 50)
    doc.rect(0, 0, pageWidth, 58, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.text('Amanah Farm', margin, 19)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Owner Performance & Operations Report', margin, 28)
    doc.setFontSize(8)
    doc.setTextColor(190, 220, 202)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 39)
    doc.addImage(farmAddress.data, 'PNG', margin, 43, farmAddress.width, farmAddress.height)
    y = 70

    section('Executive Summary')
    metrics([
      ['Total investors', number(props.totalInvestors)], ['Total invested', number(props.totalInvested)],
      ['Expected ROI', number(props.totalExpectedROI)], ['Actual ROI paid', number(props.totalActualROI)],
    ])
    section('Audience & Contact Overview')
    metrics([
      ['Active subscribers', number(props.activeSubscribers)], ['Contact requests', number(props.contactRequests)],
      ['Open enquiries', number(props.openContacts)], ['Total submissions', number(props.totalSubmissions)],
    ])
    section('Share Allocation')
    table(['Metric', 'Value'], [
      ['Owner shares', props.totalOwnerShares], ['Investor shares', props.totalInvestorShares],
      ['Shares sold', props.totalSharesSold], ['Available for sale', props.availableSharesForSale],
    ])
    section('Investment & KYC Status')
    table(['Investment status', 'Count', 'KYC status', 'Count'], [
      ['Active', props.activeInvestments, 'Approved', props.approvedKYC],
      ['Completed', props.completedInvestments, 'Pending review', props.pendingKYC],
      ['Pending', props.pendingInvestments, '', ''],
    ])
    section('Monthly Investment Trend')
    table(['Month', 'Investments', 'Total invested'], props.monthlyData.map(([month, data]) => [month, data.count, number(data.invested)]))
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(100, 115, 108)
    ensureSpace(10)
    doc.text('Prepared for internal management use.', margin, y)
    footer()
    doc.save(`Amanah Farm Report-${today()}.pdf`)
    setIsExporting(false)
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} disabled={isExporting} className="btn-secondary flex items-center gap-2">
        {isExporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</> : <><Download className="h-4 w-4" /> Export Report</>}
      </button>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription className="text-slate-400">Download a professional Amanah Farm report</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={exportCSV} variant="outline" className="flex flex-col items-center gap-3 h-32 border-slate-700 hover:bg-slate-800">
              <FileText className="h-8 w-8 text-green-400" /><div className="text-center"><div className="font-medium">CSV</div><div className="text-xs text-slate-400">Spreadsheet format</div></div>
            </Button>
            <Button onClick={exportPDF} variant="outline" className="flex flex-col items-center gap-3 h-32 border-slate-700 hover:bg-slate-800">
              <File className="h-8 w-8 text-blue-400" /><div className="text-center"><div className="font-medium">PDF</div><div className="text-xs text-slate-400">Professional report</div></div>
            </Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
