//
//  PXBankDealCollectionCell.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXBankDealCollectionCell: UICollectionViewCell {

    public static let REUSE_IDENTIFIER = "bankDealCell"

    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    override func prepareForReuse() {
        contentView.subviews.forEach({ $0.removeFromSuperview() })
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
