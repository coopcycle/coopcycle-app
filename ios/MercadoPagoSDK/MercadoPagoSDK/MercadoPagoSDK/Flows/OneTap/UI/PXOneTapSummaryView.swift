//
//  PXOneTapSummaryView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2018.
//

import UIKit

class PXOneTapSummaryView: PXComponentView {
    private var data: [PXOneTapSummaryRowData] = [] {
        willSet {
            if data.count > newValue.count {
                removeSummaryRows(oldValue: data, newValue: newValue, animated: true)
            } else if data.count < newValue.count {
                addSummaryRows(oldValue: data, newValue: newValue, animated: true)
            } else {
                updateAllRows(newData: newValue)
            }
        }
    }
    private weak var delegate: PXOneTapSummaryProtocol?
    private var rows: [PXOneTapSummaryRow] = []
    private var currentAnimator: UIViewPropertyAnimator?

    init(data: [PXOneTapSummaryRowData] = [], delegate: PXOneTapSummaryProtocol) {
        self.data = data.reversed()
        self.delegate = delegate
        super.init()
        render()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func render() {
        self.removeAllSubviews()
        self.pinContentViewToBottom()
        self.backgroundColor = ThemeManager.shared.navigationBar().backgroundColor

        var offset: CGFloat = 0
        for row in self.data {
            let rowView = self.getSummaryRowView(with: row)
            let margin = rowView.getRowMargin()

            offset += margin

            self.addSubview(rowView)
            let rowViewConstraint = PXLayout.pinBottom(view: rowView, withMargin: offset)

            offset += rowView.getRowHeight()

            self.rows.append(PXOneTapSummaryRow(data: row, view: rowView, constraint: rowViewConstraint, rowHeight: rowView.getTotalHeightNeeded()))

            if row.isTotal {
                let separatorView = UIView()
                separatorView.backgroundColor = ThemeManager.shared.boldLabelTintColor()
                separatorView.alpha = 0.1
                separatorView.translatesAutoresizingMaskIntoConstraints = false

                self.addSubview(separatorView)
                PXLayout.pinBottom(view: separatorView, withMargin: offset).isActive = true
                PXLayout.setHeight(owner: separatorView, height: 1).isActive = true
                PXLayout.pinLeft(view: separatorView, withMargin: PXLayout.M_MARGIN).isActive = true
                PXLayout.pinRight(view: separatorView, withMargin: PXLayout.M_MARGIN).isActive = true
                offset += PXLayout.S_MARGIN
                self.bringSubviewToFront(rowView)
            }

            PXLayout.centerHorizontally(view: rowView).isActive = true
            PXLayout.pinLeft(view: rowView, withMargin: 0).isActive = true
            PXLayout.pinRight(view: rowView, withMargin: 0).isActive = true
        }
    }

    func tapRow(_ sender: UITapGestureRecognizer) {
        if let rowView = sender.view as? PXOneTapSummaryRowView,
            let type = rowView.getData().type,
            let action = rowAction(for: type) {
                action()
        }
    }

    private func rowAction(for type: PXOneTapSummaryRowView.RowType) -> PXOneTapSummaryRowView.Handler? {
        switch type {
        case .charges:
            return self.delegate?.didTapCharges
        case .discount:
            return self.delegate?.didTapDiscount
        default:
            return nil
        }
    }

    func stopCurrentAnimatorIfNeeded() {
        if let cAnimator = self.currentAnimator {
            cAnimator.stopAnimation(false)
            cAnimator.finishAnimation(at: .end)
        }
    }

    func animateRows(_ rowsToAnimate: [PXOneTapSummaryRow], rowsToMove: [PXOneTapSummaryRow], newData: [PXOneTapSummaryRowData], animateIn: Bool, distance: CGFloat, completion: @escaping () -> Void) {
        let duration: Double = 0.4
        let animator = UIViewPropertyAnimator(duration: duration, dampingRatio: 1, animations: nil)

        animator.addAnimations {
            self.updateAllRows(newData: newData)
        }

        for row in rowsToAnimate {
            self.sendSubviewToBack(row.view)
            animator.addAnimations {
                row.view.alpha = animateIn ? 1 : 0
                row.constraint.constant += animateIn ? -distance : distance
                self.layoutIfNeeded()
            }
        }

        for mRow in rowsToMove {
            self.sendSubviewToBack(mRow.view)
            animator.addAnimations {
                mRow.constraint.constant += animateIn ? -distance : distance
                self.layoutIfNeeded()
            }
        }

        animator.addCompletion { (_) in
            completion()
        }

        currentAnimator = animator
        animator.startAnimation()
    }

    func removeSummaryRows(oldValue: [PXOneTapSummaryRowData], newValue: [PXOneTapSummaryRowData], animated: Bool) {
        let amountToRemove = oldValue.count - newValue.count
        var indexesToRemove: [Int] = []

        for index in 1...amountToRemove {
            indexesToRemove.append(index)
        }

        var distanceDelta: CGFloat = 0
        var rowsToRemove: [PXOneTapSummaryRow] = []
        var rowsToMove: [PXOneTapSummaryRow] = []

        for (index, row) in rows.enumerated() where !row.data.isTotal {
            if indexesToRemove.contains(index) {
                distanceDelta += row.rowHeight
                rowsToRemove.append(row)
            } else {
                rowsToMove.append(row)
            }
        }

        for row in rowsToRemove {
            if let index = self.rows.firstIndex(of: row) {
                self.rows.remove(at: index)
            }
        }

        stopCurrentAnimatorIfNeeded()
        animateRows(rowsToRemove, rowsToMove: rowsToMove, newData: newValue, animateIn: false, distance: distanceDelta) {
            for row in rowsToRemove {
                row.view.removeFromSuperview()
            }
        }
    }

    func addSummaryRows(oldValue: [PXOneTapSummaryRowData], newValue: [PXOneTapSummaryRowData], animated: Bool) {
        let amountToAdd = newValue.count - oldValue.count
        var newRowsData: [PXOneTapSummaryRowData] = []

        for index in 1...amountToAdd {
            newRowsData.append(newValue[index])
        }

        var distanceDelta: CGFloat = 0
        var rowsToAdd: [PXOneTapSummaryRow] = []
        var rowsToMove: [PXOneTapSummaryRow] = []

        for (index, rowData) in newRowsData.enumerated() {
            let rowView = getSummaryRowView(with: rowData)
            let rowHeight = rowView.getTotalHeightNeeded()
            let totalRowHeight = rows[optional: 0]?.rowHeight ?? 52
            rowView.alpha = 0

            let multiplier = rowHeight * CGFloat(index)
            let constraintConstant: CGFloat = -totalRowHeight - multiplier
            distanceDelta = rowHeight

            //View Constraints
            self.addSubview(rowView)
            let constraint = PXLayout.pinBottom(view: rowView, withMargin: -constraintConstant)
            PXLayout.centerHorizontally(view: rowView).isActive = true
            PXLayout.pinLeft(view: rowView, withMargin: 0).isActive = true
            PXLayout.pinRight(view: rowView, withMargin: 0).isActive = true
            self.layoutIfNeeded()

            let newRow = PXOneTapSummaryRow(data: rowData, view: rowView, constraint: constraint, rowHeight: rowHeight)
            rowsToAdd.append(newRow)
            rows.insert(newRow, at: index+1)
        }

        for row in rows where !row.data.isTotal && !newRowsData.contains(row.data) {
            rowsToMove.append(row)
        }

        stopCurrentAnimatorIfNeeded()
        animateRows(rowsToAdd, rowsToMove: rowsToMove, newData: newValue, animateIn: true, distance: distanceDelta) {
        }
    }

    func updateAllRows(newData: [PXOneTapSummaryRowData]) {
        for (index, row) in rows.enumerated() {
            let newRowData = newData[index]
            row.view.update(newRowData)
            row.updateData(newRowData)
        }
    }

    func update(_ newData: [PXOneTapSummaryRowData], hideAnimatedView: Bool = false) {
        self.data = newData.reversed()
    }

    func getSummaryRowView(with data: PXOneTapSummaryRowData) -> PXOneTapSummaryRowView {
        let rowView = PXOneTapSummaryRowView(data: data)

        //Tap Gesture
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.tapRow(_:)))
        rowView.addGestureRecognizer(tap)
        rowView.isUserInteractionEnabled = true

        return rowView
    }
}
