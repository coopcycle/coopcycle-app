//
//  MPButton.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 3/28/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

@objcMembers
internal class MPButton: UIButton {

    var actionLink: String?

    override init(frame: CGRect) {
        super.init(frame: frame)
        updateFonts()
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        updateFonts()
    }

}

// MARK: - Internals
extension MPButton {
    internal func updateFonts() {
        if let titleLabel = titleLabel, let titleFont = titleLabel.font {
            self.titleLabel?.font = Utils.getFont(size: titleFont.pointSize)
        }
    }
}
