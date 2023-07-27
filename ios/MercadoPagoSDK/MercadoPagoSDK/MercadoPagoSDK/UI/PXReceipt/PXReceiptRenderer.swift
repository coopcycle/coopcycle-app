//
//  PXReceiptRenderer.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 4/12/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXReceiptRenderer: NSObject {
    let FONT_SIZE: CGFloat = PXLayout.XXS_FONT
    let LABEL_SIZE: CGFloat = PXLayout.S_FONT

    func render(_ component: PXReceiptComponent) -> PXReceiptView {
        let receiptView = PXReceiptView()
        receiptView.translatesAutoresizingMaskIntoConstraints = false
        if let dateString = component.props.dateLabelString {
            let dateLabel = makeLabel(text: dateString)
            receiptView.addSubview(dateLabel)
            receiptView.dateLabel = dateLabel
            PXLayout.pinTop(view: dateLabel, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.matchWidth(ofView: dateLabel).isActive = true
        }

        if let detailString = component.props.receiptDescriptionString {
            let detailLabel = makeLabel(text: detailString)
            receiptView.addSubview(detailLabel)
            receiptView.detailLabel = detailLabel
            PXLayout.pinBottom(view: detailLabel, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.matchWidth(ofView: detailLabel).isActive = true
            receiptView.putOnBottomOfLastView(view: detailLabel)?.isActive = true
        }

        return receiptView
    }

    func settupLabel() -> UILabel {
        let label = UILabel()
        label.font = Utils.getFont(size: FONT_SIZE)
        label.textColor = UIColor.pxBrownishGray
        label.textAlignment = .center
        return label
    }

    func makeLabel(text: String) -> UILabel {
        let label = settupLabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = text
        PXLayout.setHeight(owner: label, height: LABEL_SIZE).isActive = true
        return label
    }
}

class PXReceiptView: PXComponentView {
    var dateLabel: UILabel?
    var detailLabel: UILabel?
}
