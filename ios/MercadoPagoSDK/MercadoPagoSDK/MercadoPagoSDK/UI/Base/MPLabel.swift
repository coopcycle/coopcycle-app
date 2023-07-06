//
//  MPLabel.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 3/28/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class MPLabel: UILabel {

    static let defaultColorText = UIColor(red: 51, green: 51, blue: 51)
    static let highlightedColorText = UIColor(red: 51, green: 51, blue: 51)
    static let errorColorText = UIColor(red: 51, green: 51, blue: 51)

    override init(frame: CGRect) {
        super.init(frame: frame)
        updateFonts()
     }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        updateFonts()
    }

    func addCharactersSpacing(_ spacing: CGFloat) {
        let attributedString = NSMutableAttributedString()
        if self.attributedText != nil {
            attributedString.append(self.attributedText!)
        }
        attributedString.addAttribute(NSAttributedString.Key.kern, value: spacing, range: NSRange(location: 0, length: self.attributedText!.length))
        self.attributedText = attributedString
    }

    func addLineSpacing(_ lineSpacing: Float, centered: Bool = true) {
        let attributedString = NSMutableAttributedString()
        if self.attributedText != nil {
            attributedString.append(self.attributedText!)
        }
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineSpacing = CGFloat(lineSpacing)
        if centered {
            paragraphStyle.alignment = .center
        }
        attributedString.addAttribute(NSAttributedString.Key.paragraphStyle, value: paragraphStyle, range: NSRange(location: 0, length: attributedString.length))
        self.attributedText = attributedString
    }
}

// MARK: - Internals
extension MPLabel {
    internal func updateFonts() {
        if let labelFont = font {
            self.font = Utils.getFont(size: labelFont.pointSize)
        }
    }
}
