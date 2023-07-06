//
//  NewResultContainterCell.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 03/09/2019.
//

import UIKit

class NewResultContainterCell: UITableViewCell {

    var content: UIView?

    func setContent(view: UIView) {
        self.content = view
        render(with: view)
    }

    func render(with view: UIView) {
        removeAllSubviews()
        selectionStyle = .none
        addSubview(view)
        PXLayout.pinAllEdges(view: view, withMargin: PXLayout.ZERO_MARGIN)

        self.layoutIfNeeded()
    }
}
