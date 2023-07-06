//
//  MPTextField.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 3/28/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

@objcMembers
internal class MPTextField: UITextField {

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
extension MPTextField {
    internal func updateFonts() {
        if let textFieldFont = font {
            self.font = Utils.getFont(size: textFieldFont.pointSize)
        }
    }
}
