//
//  UILabel+Additions.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 29/10/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import Foundation

internal extension UILabel {
    static func requiredHeight(forText text: String, withFont font: UIFont, inNumberOfLines lines: Int = 0, inWidth width: CGFloat) -> CGFloat {
        let label: UILabel = UILabel(frame: CGRect(x: 0, y: 0, width: width, height: CGFloat.greatestFiniteMagnitude))
        label.text = text
        label.font = font
        return label.requiredHeight(numberOfLines: lines)
    }

    static func requiredHeight(forAttributedText text: NSAttributedString, withFont font: UIFont, inNumberOfLines lines: Int = 0, inWidth width: CGFloat) -> CGFloat {
        let label: UILabel = UILabel(frame: CGRect(x: 0, y: 0, width: width, height: CGFloat.greatestFiniteMagnitude))
        label.attributedText = text
        label.font = font
        return label.requiredAttributedHeight(numberOfLines: lines)
    }

    func requiredHeight(numberOfLines: Int = 0) -> CGFloat {
        let label: UILabel = UILabel(frame: CGRect(x: 0, y: 0, width: self.frame.width, height: CGFloat.greatestFiniteMagnitude))
        label.numberOfLines = numberOfLines
        label.lineBreakMode = NSLineBreakMode.byWordWrapping
        label.font = self.font
        label.text = self.text
        label.sizeToFit()
        return label.frame.height
    }
    func requiredAttributedHeight(numberOfLines: Int = 0) -> CGFloat {
        let label: UILabel = UILabel(frame: CGRect(x: 0, y: 0, width: self.frame.width, height: CGFloat.greatestFiniteMagnitude))
        label.numberOfLines = numberOfLines
        label.lineBreakMode = NSLineBreakMode.byWordWrapping
        label.font = self.font
        label.attributedText = self.attributedText
        label.sizeToFit()
        return label.frame.height
    }

    static func getHeight(width: CGFloat, font: UIFont, text: String) -> CGFloat {
        let label: UILabel = UILabel(frame: CGRect(x: 0, y: 0, width: width, height: CGFloat.greatestFiniteMagnitude))
        label.numberOfLines = 0
        label.lineBreakMode = NSLineBreakMode.byWordWrapping
        label.font = font
        label.text = text
        label.sizeToFit()
        return label.frame.height
    }

    func clearAttributedText() {
        self.attributedText = NSAttributedString(string: "")
    }

    func clearText() {
        self.text = ""
    }
}

internal extension NSAttributedString {
    func heightWithConstrainedWidth(width: CGFloat) -> CGFloat {
        let constraintRect = CGSize(width: width, height: .greatestFiniteMagnitude)
        let boundingBox = self.boundingRect(with: constraintRect, options: .usesLineFragmentOrigin, context: nil)
        return boundingBox.height
    }

    func widthWithConstrainedHeight(height: CGFloat) -> CGFloat {
        let constraintRect = CGSize(width: .greatestFiniteMagnitude, height: height)
        let boundingBox = self.boundingRect(with: constraintRect, options: .usesLineFragmentOrigin, context: nil)
        return boundingBox.width
    }
}
