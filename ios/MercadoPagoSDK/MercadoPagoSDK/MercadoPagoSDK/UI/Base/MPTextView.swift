//
//  MPTextView.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 12/4/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class MPTextView: UITextView {

    override public init(frame: CGRect, textContainer: NSTextContainer?) {
        super.init(frame: frame, textContainer: textContainer)

    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
            }

    func addCharactersSpacing(_ spacing: CGFloat) {
        let attributedString = NSMutableAttributedString()
        if self.attributedText != nil {
            attributedString.append(self.attributedText!)
        }

        attributedString.addAttribute(NSAttributedString.Key.kern, value: spacing, range: NSRange(location: 0, length: self.attributedText!.length))
        self.attributedText = attributedString
    }

    func addLineSpacing(_ lineSpacing: Float) {

        let attributedString = NSMutableAttributedString()
        if self.attributedText != nil {
            attributedString.append(self.attributedText!)
        }
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineSpacing = CGFloat(lineSpacing)
        paragraphStyle.alignment = .center

        attributedString.addAttribute(NSAttributedString.Key.paragraphStyle, value: paragraphStyle, range: NSRange(location: 0, length: attributedString.length))
        self.attributedText = attributedString

    }
}
