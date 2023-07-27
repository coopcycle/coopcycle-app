//
//  AppDecorationKeeper.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 2/24/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class NavigationControllerMemento {

    var navBarTintColor: UIColor?
    var navTintColor: UIColor?
    var navTitleTextAttributes: [NSAttributedString.Key: Any]?
    var navIsTranslucent: Bool = false
    var navViewBackgroundColor: UIColor?
    var navBackgroundColor: UIColor?
    var navBackgroundImage: UIImage?
    var navShadowImage: UIImage?
    var navBarStyle: UIBarStyle?
    weak var customDelegate: UINavigationControllerDelegate?
    var swipeBackGesture: Bool = true
    var isNavigationBarHidden: Bool = true

    init(navigationController: UINavigationController) {
        navBarTintColor = navigationController.navigationBar.barTintColor
        navTintColor = navigationController.navigationBar.tintColor
        navTitleTextAttributes = navigationController.navigationBar.titleTextAttributes
        navIsTranslucent = navigationController.navigationBar.isTranslucent
        navViewBackgroundColor = navigationController.view.backgroundColor
        navBackgroundColor = navigationController.navigationBar.backgroundColor
        navBackgroundImage = navigationController.navigationBar.backgroundImage(for: .default)
        navShadowImage = navigationController.navigationBar.shadowImage
        navBarStyle = navigationController.navigationBar.barStyle
        customDelegate = navigationController.delegate
        isNavigationBarHidden = navigationController.isNavigationBarHidden
        if let backGesture = navigationController.interactivePopGestureRecognizer?.isEnabled {
           swipeBackGesture = backGesture
        }
    }
}
