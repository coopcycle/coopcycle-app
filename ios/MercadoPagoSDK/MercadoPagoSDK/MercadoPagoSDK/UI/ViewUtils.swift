//
//  ViewUtil.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 21/4/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import Foundation
import UIKit

internal class ViewUtils {

    class func getTableCellSeparatorLineView(_ posX: CGFloat, posY: CGFloat, width: CGFloat, height: CGFloat) -> UIView {
        let separatorLineView = UIView(frame: CGRect(x: posX, y: posY, width: width, height: height))
        separatorLineView.layer.zPosition = 1
        separatorLineView.backgroundColor = UIColor.grayTableSeparator()
        return separatorLineView
    }

    class func getStatusBarHeight() -> CGFloat {
        var defaultHeight: CGFloat = 20
        // iPhoneX or any device with safe area inset > 0
        if #available(iOS 11.0, *) {
            let window = UIApplication.shared.keyWindow
            let topSafeAreaPadding = window?.safeAreaInsets.top
            if let topSafeAreaDeltaValue = topSafeAreaPadding, topSafeAreaDeltaValue > 0 {
                defaultHeight = topSafeAreaDeltaValue
            }
        }
        return defaultHeight
    }

    class func getStatusBarHeightForScrolling() -> CGFloat {
        var defaultHeight: CGFloat = 20
        // iPhoneX or any device with safe area inset > 0
        if #available(iOS 11.0, *) {
            let window = UIApplication.shared.keyWindow
            let topSafeAreaPadding = window?.safeAreaInsets.top
            if let topSafeAreaDeltaValue = topSafeAreaPadding, topSafeAreaDeltaValue > 0 {
                defaultHeight = 0
            }
        }
        return defaultHeight
    }

    class func addStatusBar(_ view: UIView, color: UIColor) {
        let addStatusBar = UIView(frame: CGRect(x: 0, y: 0, width: view.bounds.width, height: getStatusBarHeight()))
        addStatusBar.backgroundColor = color
        view.addSubview(addStatusBar)
    }

    class func getCustomNavigationTitleLabel(textColor: UIColor, font: UIFont, titleText: String?) -> UILabel {
        let titleLabelView = UILabel(frame: CGRect(x: 0, y: 0, width: 0, height: 44))
        titleLabelView.backgroundColor = .clear
        titleLabelView.textAlignment = .center
        titleLabelView.textColor = textColor
        titleLabelView.font = font
        titleLabelView.text = titleText
        return titleLabelView
    }

    class func loadImageFromUrl(_ imageURL: String?) -> UIImage? {
        guard let imageURL = imageURL else {
            return nil
        }
        let url = URL(string: imageURL)
        if url != nil {
            let data = try? Data(contentsOf: url!)
            if data != nil {
                let image = UIImage(data: data!)
                return image
            } else {
                return nil
            }
        } else {
            return nil
        }
    }

    func getSeparatorLineForTop(width: Double, posY: Float) -> UIView {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(posY)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        return line
    }

    class func drawBottomLine(_ posX: CGFloat = 0, posY: CGFloat, width: CGFloat, inView view: UIView) {
        let overLinewView = UIView(frame: CGRect(x: posX, y: posY, width: width, height: 1))
        overLinewView.backgroundColor = UIColor.UIColorFromRGB(0xDEDEDE)
        view.addSubview(overLinewView)
    }

}
