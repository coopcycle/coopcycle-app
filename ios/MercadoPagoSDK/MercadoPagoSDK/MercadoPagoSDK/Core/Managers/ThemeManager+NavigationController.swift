//
//  ThemeManager+NavigationController.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 15/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension ThemeManager {
    func saveNavBarStyleFor(navigationController: UINavigationController) {
        self.navigationControllerMemento = NavigationControllerMemento(navigationController: navigationController)
    }

    func applyAppNavBarStyle(navigationController: UINavigationController) {
        guard let navControllerMemento = self.navigationControllerMemento else {
            return
        }
        navigationController.navigationBar.barTintColor = navControllerMemento.navBarTintColor
        navigationController.navigationBar.titleTextAttributes = navControllerMemento.navTitleTextAttributes
        navigationController.navigationBar.tintColor = navControllerMemento.navTintColor
        navigationController.navigationBar.titleTextAttributes = navControllerMemento.navTitleTextAttributes
        navigationController.navigationBar.isTranslucent = navControllerMemento.navIsTranslucent
        navigationController.navigationBar.backgroundColor = navControllerMemento.navBackgroundColor
        navigationController.navigationBar.restoreBottomLine()
        navigationController.navigationBar.setBackgroundImage(navControllerMemento.navBackgroundImage, for: UIBarMetrics.default)
        navigationController.navigationBar.shadowImage = navControllerMemento.navShadowImage
        navigationController.delegate = navControllerMemento.customDelegate
        if navControllerMemento.navBarStyle != nil {
            navigationController.navigationBar.barStyle = navControllerMemento.navBarStyle!
        }
        navigationController.interactivePopGestureRecognizer?.isEnabled = navControllerMemento.swipeBackGesture
        navigationController.setNavigationBarHidden(navControllerMemento.isNavigationBarHidden, animated: false)
    }
}
