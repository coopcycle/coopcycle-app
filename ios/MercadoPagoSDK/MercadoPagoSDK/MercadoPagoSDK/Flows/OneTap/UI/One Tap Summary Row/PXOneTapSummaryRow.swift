//
//  PXOneTapSummaryRow.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 26/08/2019.
//

import UIKit

class PXOneTapSummaryRow: Equatable {
    static func == (lhs: PXOneTapSummaryRow, rhs: PXOneTapSummaryRow) -> Bool {
        return lhs.rowHeight == rhs.rowHeight && lhs.constraint == rhs.constraint && lhs.view == rhs.view && lhs.data == rhs.data
    }

    var data: PXOneTapSummaryRowData
    var view: PXOneTapSummaryRowView
    var constraint: NSLayoutConstraint
    var rowHeight: CGFloat

    init(data: PXOneTapSummaryRowData, view: PXOneTapSummaryRowView, constraint: NSLayoutConstraint, rowHeight: CGFloat) {
        self.data = data
        self.view = view
        self.constraint = constraint
        self.rowHeight = rowHeight
    }

    func updateData(_ data: PXOneTapSummaryRowData) {
        self.data = data
    }
}
