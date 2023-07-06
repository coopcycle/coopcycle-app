//
//  PXThemeProperty.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 10/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Use this object to create certain properties to define `PXTheme` implementation.
 */
@objcMembers
open class PXThemeProperty: NSObject {
    let backgroundColor: UIColor
    let tintColor: UIColor

    // MARK: Init.
    /**
     - parameter backgroundColor: Determinate the background property color.
     - parameter tintColor: Determinate the tint property color.
     */
    public init (backgroundColor: UIColor, tintColor: UIColor) {
        self.backgroundColor = backgroundColor
        self.tintColor = tintColor
    }

    // MARK: Getters.
    /**
     Getter for getBackgroundColor property.
     */
    open func getBackgroundColor() -> UIColor {
        return backgroundColor
    }

    /**
     Getter for getTintColor property.
     */
    open func getTintColor() -> UIColor {
        return tintColor
    }
}
