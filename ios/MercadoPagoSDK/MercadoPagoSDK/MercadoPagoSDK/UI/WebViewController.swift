//
//  WebViewController.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 22/5/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit
import WebKit

class WebViewController: MercadoPagoUIViewController {

    var url: URL
    var navBarTitle: String
    let webView: WKWebView
    let forceAddNavBar: Bool
    private var loadingVC: PXLoadingViewController

    init(url: URL, navigationBarTitle: String, forceAddNavBar: Bool = false) {
        self.url = url
        self.navBarTitle = navigationBarTitle
        self.forceAddNavBar = forceAddNavBar
        self.loadingVC = PXLoadingViewController()
        let webConfiguration = WKWebViewConfiguration()
        self.webView = WKWebView(frame: .zero, configuration: webConfiguration)
        super.init(nibName: nil, bundle: nil)
    }

    @objc func close() {
        self.dismiss(animated: true, completion: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.navigationDelegate = self
        loadUrl(url)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.backgroundColor = .white
        view.addSubview(webView)
        PXLayout.pinLeft(view: webView).isActive = true
        PXLayout.pinRight(view: webView).isActive = true
        PXLayout.pinBottom(view: webView).isActive = true

        if self.navigationController == nil, forceAddNavBar {
            addNavigationBar()
        } else {
            PXLayout.pinTop(view: webView).isActive = true
        }

        view.backgroundColor = ThemeManager.shared.getMainColor()
        loadingVC.modalPresentationStyle = .fullScreen
        present(loadingVC, animated: false, completion: nil)
    }

    func addNavigationBar() {
        let navBar: UINavigationBar = UINavigationBar(frame: CGRect(x: 0, y: PXLayout.getSafeAreaTopInset(), width: PXLayout.getScreenWidth(), height: PXLayout.NAV_BAR_HEIGHT))
        self.view.addSubview(navBar)

        navBar.isTranslucent = true
        navBar.barTintColor = ThemeManager.shared.whiteColor()
        navBar.tintColor = ThemeManager.shared.navigationBar().tintColor
        navBar.backgroundColor = ThemeManager.shared.getMainColor()
        navBar.setBackgroundImage(UIImage(), for: UIBarMetrics.default)

        let textAttributes = [NSAttributedString.Key.foregroundColor: ThemeManager.shared.navigationBar().tintColor]
        navBar.titleTextAttributes = textAttributes

        let navItem = UINavigationItem(title: navBarTitle)
        let closeImage = ResourceManager.shared.getImage("modal_close_button")?.ml_tintedImage(with: ThemeManager.shared.navigationBar().getTintColor())
        let closeButton = UIBarButtonItem(image: closeImage, style: .plain, target: self, action: #selector(close))
        navItem.leftBarButtonItem = closeButton
        navBar.setItems([navItem], animated: false)
        PXLayout.put(view: webView, onBottomOf: navBar).isActive = true
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        showNavBar()
        trackScreen()
    }

    override func getNavigationBarTitle() -> String {
        return navBarTitle
    }

    func loadUrl(_ url: URL) {
        if let html = HtmlStorage.shared.getHtml(url.absoluteString) {
            webView.loadHTMLString(html, baseURL: nil)
            loadingVC.dismiss(animated: false, completion: nil)
        } else {
            let requestObj = URLRequest(url: url)
            webView.load(requestObj)
        }
    }
}

extension WebViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingVC.dismiss(animated: false, completion: nil)
    }
}

// MARK: Tracking
extension WebViewController {
    func trackScreen() {
        var properties: [String: Any] = [:]
        properties["url"] = url.absoluteString
        trackScreen(path: TrackingPaths.Screens.getTermsAndCondiontionPath(), properties: properties)
    }
}
