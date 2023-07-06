//
//  PXDefaultTheme.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 10/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

class PXDefaultTheme: NSObject {
    let primaryColor: UIColor
    public init(withPrimaryColor: UIColor) {
        self.primaryColor = withPrimaryColor
    }
}

// MARK: - Theme styles.
/** :nodoc: */
extension PXDefaultTheme: PXTheme {
    public func navigationBar() -> PXThemeProperty {
        return PXThemeProperty(backgroundColor: primaryColor, tintColor: #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1))
    }

    public func loadingComponent() -> PXThemeProperty {
        return PXThemeProperty(backgroundColor: #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1), tintColor: primaryColor)
    }

    public func highlightBackgroundColor() -> UIColor {
        return #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
    }

    public func detailedBackgroundColor() -> UIColor {
        return #colorLiteral(red: 0.968627451, green: 0.968627451, blue: 0.968627451, alpha: 1)
    }

    public func statusBarStyle() -> UIStatusBarStyle {
        return .lightContent
    }
}
