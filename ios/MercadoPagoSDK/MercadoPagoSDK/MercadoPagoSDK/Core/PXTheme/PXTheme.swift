//
//  PXTheme.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 9/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Protocol to define advanced customization of your UI.
 */
@objc public protocol PXTheme {
    // MARK: Customization.
    /**
     Define your navigation bar color. `PXThemeProperty` background and `PXThemeProperty` tint color for font color.
     */
    func navigationBar() -> PXThemeProperty
    /**
     Full screen loading colores. `PXThemeProperty` background and `PXThemeProperty` tint color for animated spinner color.
     */
    func loadingComponent() -> PXThemeProperty
    /**
     Use this color for Revisa & Confirma screen header background color.
     */
    func highlightBackgroundColor() -> UIColor
    /**
     Use this color for Revisa & Confirma body background color.
     */
    func detailedBackgroundColor() -> UIColor
    /**
     Optional method to override the color of navigation bar text color for highlight backgrounds.
     */
    @objc optional func highlightNavigationTintColor() -> UIColor?
    // MARK: Customize status bar
    /**
     Checkout status bar style. Use the native `UIStatusBarStyle`
     */
    func statusBarStyle() -> UIStatusBarStyle
    // MARK: Customize fonts.
    /**
     Optional method to set your custom font.
     */
    @objc optional func fontName() -> String?
    /**
     Optional method to set your custom light font.
     */
    @objc optional func lightFontName() -> String?
    /**
     Optional method to set your custom  semi-bold font.
     */
    @objc optional func semiBoldFontName() -> String?
}
