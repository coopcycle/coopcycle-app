//
//  MercadoPagoUIViewController.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 3/2/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class MercadoPagoUIViewController: UIViewController, UIGestureRecognizerDelegate {

    private static let MLNavigationBarBackgroundViewTag = 569242

    var callbackCancel: (() -> Void)?
    var callbackBack: (() -> Void)?
    var navBarTextColor = ThemeManager.shared.navigationBar().tintColor
    private var navBarBackgroundColor = ThemeManager.shared.getMainColor()
    var shouldDisplayBackButton = false
    var shouldHideNavigationBar = false
    var shouldShowBackArrow = true

    let STATUS_BAR_HEIGTH = ViewUtils.getStatusBarHeight()
    let NAV_BAR_HEIGHT = 44.0
    var navBarFontSize: CGFloat = 18

    var loadingView: UIView?

    // TODO: Deprecate after PaymentVault & AditionalStep redesign/refactor.
    var hideNavBarCallback: (() -> Void)?

    var screenPath: String?
    var treatBackAsAbort: Bool = false

    override open func viewDidLoad() {
        super.viewDidLoad()
        self.loadMPStyles()
    }
    
    override var preferredStatusBarStyle : UIStatusBarStyle {
        return ThemeManager.shared.statusBarStyle()
    }

    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.interactivePopGestureRecognizer?.isEnabled = false
        self.loadMPStyles()

        if shouldHideNavigationBar {
            navigationController?.setNavigationBarHidden(true, animated: false)
        } else {
            navigationController?.setNavigationBarHidden(false, animated: false)
        }

        /**
         The following line is to temporarily fix the MLHeaderBehaviour issue in Mercado Libre. ML places a view in the navigation
         bar with the MLNavigationBarBackgroundViewTag tag to make it opaque. Unfortunately, there's no easy way to hide this
         view when we present MercadoPagoSDK. This temporary fix checks if this view exists, and if it does, it sets it's background
         color clear so it doesn't interfere with MercadoPagoSDK colors.
         **/
        if let navigationBarBackgroundView = navigationController?.navigationBar.viewWithTag(MercadoPagoUIViewController.MLNavigationBarBackgroundViewTag) {
            navigationBarBackgroundView.backgroundColor = UIColor.clear
        }
    }

    open override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        if shouldHideNavigationBar {
            navigationController?.setNavigationBarHidden(false, animated: false)
        }
    }

    func totalContentViewHeigth() -> CGFloat {
        return UIScreen.main.bounds.height - getReserveSpace()
    }

    func getReserveSpace() -> CGFloat {
        var totalReserveSpace: CGFloat = PXLayout.getStatusBarHeight()

        if !shouldHideNavigationBar {
            totalReserveSpace += CGFloat(NAV_BAR_HEIGHT)
        }
        return totalReserveSpace
    }

    internal func loadMPStyles() {
        if self.navigationController != nil {
            var titleDict: [NSAttributedString.Key: Any] = [:]
            //Navigation bar colors
            let fontChosed = Utils.getFont(size: navBarFontSize)
            titleDict = [NSAttributedString.Key.foregroundColor: navBarTextColor, NSAttributedString.Key.font: fontChosed]

            if titleDict.count > 0 {
                self.navigationController!.navigationBar.titleTextAttributes = titleDict
            }
            self.navigationItem.hidesBackButton = true
            self.navigationController?.navigationBar.tintColor = navBarBackgroundColor
            self.navigationController?.navigationBar.barTintColor = navBarBackgroundColor
            self.navigationController?.navigationBar.removeBottomLine()
            self.navigationController?.navigationBar.isTranslucent = false
            self.navigationController?.view.backgroundColor = navBarBackgroundColor

            //Create navigation buttons
            displayBackButton()
        }
    }

    override open var shouldAutorotate: Bool {
        return false
    }

    override open var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return UIInterfaceOrientationMask.portrait
    }

    internal func displayBackButton() {
        if shouldShowBackArrow {
            let backButton = UIBarButtonItem()
            backButton.image = ResourceManager.shared.getImage("back")
            backButton.style = .plain
            backButton.target = self
            backButton.tintColor = navBarTextColor
            backButton.action = #selector(MercadoPagoUIViewController.executeBack)
            self.navigationItem.leftBarButtonItem = backButton
        }
    }

    internal func hideBackButton() {
        self.navigationItem.leftBarButtonItem = nil
    }

    @objc internal func executeBack() {
        if let targetNavigationController = navigationController {
            // TODO: Tener en cuenta las pantallas que no son de PX.
            let vcs = targetNavigationController.viewControllers.filter { $0.isKind(of: MercadoPagoUIViewController.self) }
            if vcs.count == 1 {
                if let callbackBackAction = callbackBack {
                    callbackBackAction()
                }

                trackAbortEvent()
                PXNotificationManager.Post.attemptToClose()
                return
            }
        }
        if treatBackAsAbort {
            trackAbortEvent()
        } else {
            trackBackEvent()
        }

        if let callbackBackAction = callbackBack {
            callbackBackAction()
        }
        if let callbackCancel = callbackCancel {
            callbackCancel()
            return
        }
        navigationController?.popViewController(animated: true)
    }

    internal func hideLoading() {
        PXComponentFactory.Loading.instance().hide()
        loadingView = nil
    }

    internal func showLoading() {
        loadingView = PXComponentFactory.Loading.instance().showInView(view)
        if let lView = loadingView {
            view.bringSubviewToFront(lView)
        }
    }

    open func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {

        //En caso de que el vc no sea root
        if navigationController != nil && navigationController!.viewControllers.count > 1 && navigationController!.viewControllers[0] != self {
            return true
        }
        return false
    }

    func showNavBar() {
        if navigationController != nil {
            self.title = self.getNavigationBarTitle()
            self.navigationController?.navigationBar.setBackgroundImage(nil, for: UIBarMetrics.default)
            self.navigationController?.navigationBar.shadowImage = nil
            self.navigationController?.navigationBar.tintColor = navBarBackgroundColor
            self.navigationController?.navigationBar.backgroundColor = navBarBackgroundColor
            self.navigationController?.navigationBar.isTranslucent = false

            if self.shouldDisplayBackButton {
                self.displayBackButton()
            }

            let font: UIFont = Utils.getFont(size: navBarFontSize)
            let titleDict: [NSAttributedString.Key: Any] = [NSAttributedString.Key.foregroundColor: ThemeManager.shared.navigationBar().tintColor, NSAttributedString.Key.font: font]
            self.navigationController?.navigationBar.titleTextAttributes = titleDict
        }

    }

    func hideNavBar() {
        if navigationController != nil {
            self.title = ""
            navigationController?.navigationBar.titleTextAttributes = nil
            self.navigationController?.navigationBar.removeBottomLine()
            self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: UIBarMetrics.default)
            self.navigationController?.navigationBar.shadowImage = UIImage()
            self.navigationController!.navigationBar.backgroundColor = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 0.0)
            self.navigationController?.navigationBar.isTranslucent = true

            if self.shouldDisplayBackButton {
                self.displayBackButton()
            }

            if self.hideNavBarCallback != nil {
                hideNavBarCallback!()
            }
        }
    }

    func getNavigationBarTitle() -> String {
        return ""
    }

    func setNavBarBackgroundColor(color: UIColor) {
        self.navBarBackgroundColor = color
    }

    deinit {
        #if DEBUG
            print("DEINIT - \(self)")
        #endif
    }
}

/** :nodoc: */
extension UINavigationController {
    override open var shouldAutorotate: Bool {
        return (self.viewControllers.count > 0 && self.viewControllers.last!.shouldAutorotate)
    }
}

internal extension UINavigationBar {
    func removeBottomLine() {
        self.setValue(true, forKey: "hidesShadow")
    }
    func restoreBottomLine() {
        self.setValue(false, forKey: "hidesShadow")
    }
}
