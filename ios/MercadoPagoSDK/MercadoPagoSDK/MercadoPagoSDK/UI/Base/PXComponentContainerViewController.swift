//
//  PXComponentContainerViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 11/8/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXComponentContainerViewController: MercadoPagoUIViewController {

    private lazy var elasticHeader = UIView()
    private lazy var customNavigationTitle: String = ""
    private lazy var secondaryCustomNavigationTitle: String = ""
    private lazy var NAVIGATION_BAR_DELTA_Y: CGFloat = 29.8
    private lazy var NAVIGATION_BAR_SECONDARY_DELTA_Y: CGFloat = 0
    private lazy var navigationTitleStatusStep: Int = 0

    var scrollView: UIScrollView!
    var contentView = PXComponentView()
    var heightComponent: NSLayoutConstraint!
    var lastViewConstraint: NSLayoutConstraint!
    var scrollViewPinBottomConstraint: NSLayoutConstraint!
    private var topContentConstraint: NSLayoutConstraint?

    init(adjustInsets: Bool = true) {
        scrollView = UIScrollView()
        scrollView.backgroundColor = .white
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.delaysContentTouches = true
        scrollView.canCancelContentTouches = false
        scrollView.isUserInteractionEnabled = true
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)

        topContentConstraint = PXLayout.pinTop(view: contentView, to: scrollView)
        topContentConstraint?.isActive = true
        PXLayout.centerHorizontally(view: contentView, to: scrollView).isActive = true
        PXLayout.matchWidth(ofView: contentView, toView: scrollView).isActive = true
        contentView.backgroundColor = .white
        super.init(nibName: nil, bundle: nil)

        if adjustInsets {
            self.adjustInsets()
        }

        view.addSubview(scrollView)

        PXLayout.pinLeft(view: scrollView, to: view).isActive = true
        PXLayout.pinRight(view: scrollView, to: view).isActive = true
        PXLayout.pinTop(view: scrollView, to: view).isActive = true

        let bottomDeltaMargin: CGFloat = PXLayout.getSafeAreaBottomInset()

        scrollViewPinBottomConstraint = PXLayout.pinBottom(view: scrollView, to: view, withMargin: -bottomDeltaMargin)
        scrollViewPinBottomConstraint.isActive = true

        scrollView.bounces = false
    }

    func adjustInsets() {
        if #available(iOS 11.0, *) {
            scrollView.contentInsetAdjustmentBehavior = .never
        } else {
            automaticallyAdjustsScrollViewInsets = false
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        handleNavigationBarEffect(scrollView)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func centerContentView(margin: CGFloat = 0) -> Bool {
        if contentView.frame.height < PXLayout.getScreenHeight() - PXLayout.NAV_BAR_HEIGHT - PXLayout.getStatusBarHeight() {
            topContentConstraint?.isActive = false
            PXLayout.centerVertically(view: contentView, to: scrollView, withMargin: margin).isActive = true
            return true
        }
        return false
    }

    func setBackground(color: UIColor?) {
        view.backgroundColor = color
        scrollView.backgroundColor = color
        contentView.setBackground(color: color)
    }
}

// MARK: Elastic header.
extension PXComponentContainerViewController: UIScrollViewDelegate {
    func addElasticHeader(headerBackgroundColor: UIColor?, navigationCustomTitle: String, textColor: UIColor, navigationSecondaryTitle: String?=nil, navigationDeltaY: CGFloat?=nil, navigationSecondaryDeltaY: CGFloat?=nil) {
        elasticHeader.removeFromSuperview()
        scrollView.delegate = self
        customNavigationTitle = navigationCustomTitle
        elasticHeader.backgroundColor = headerBackgroundColor
        if let customDeltaY = navigationDeltaY {
            NAVIGATION_BAR_DELTA_Y = customDeltaY
        }
        if let customSecondaryDeltaY = navigationSecondaryDeltaY {
            NAVIGATION_BAR_SECONDARY_DELTA_Y = customSecondaryDeltaY
        }
        if let secondaryTitle = navigationSecondaryTitle {
            secondaryCustomNavigationTitle = secondaryTitle
        } else {
            secondaryCustomNavigationTitle = navigationCustomTitle
        }

        view.insertSubview(elasticHeader, aboveSubview: contentView)
        scrollView.bounces = true

        let titleView = ViewUtils.getCustomNavigationTitleLabel(textColor: textColor, font: Utils.getFont(size: PXLayout.S_FONT), titleText: "")
        navigationItem.titleView = titleView
    }

    func refreshContentViewSize() {
        var height: CGFloat = 0
        for view in contentView.getSubviews() {
            height += view.frame.height
        }
        height += contentView.getCarryMarginY()
        contentView.fixHeight(height: height)
        scrollView.contentSize = CGSize(width: PXLayout.getScreenWidth(), height: height)
        view.layoutIfNeeded()
    }

    func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        if scrollView.contentOffset.y > 0 && scrollView.contentOffset.y <= 32 {
            UIView.animate(withDuration: 0.25, animations: {
                targetContentOffset.pointee.y = 32
            })
        }
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        handleNavigationBarEffect(scrollView)
        elasticHeader.frame = CGRect(x: 0, y: 0, width: contentView.frame.width, height: -scrollView.contentOffset.y)
    }

    fileprivate func handleNavigationBarEffect(_ targetScrollView: UIScrollView) {

        let offset = targetScrollView.contentOffset.y
        let STATUS_TITLE_BREAKPOINT: Int = 2

        if offset >= NAVIGATION_BAR_DELTA_Y {
            if navigationTitleStatusStep < STATUS_TITLE_BREAKPOINT {
                let titleAnimation = CATransition()
                titleAnimation.duration = 0.5
                titleAnimation.type = CATransitionType.push
                titleAnimation.subtype = CATransitionSubtype.fromTop
                titleAnimation.timingFunction = CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeInEaseOut)
                navigationItem.titleView?.layer.add(titleAnimation, forKey: "changeTitle")
                (navigationItem.titleView as? UILabel)?.sizeToFit()
                (navigationItem.titleView as? UILabel)?.text = customNavigationTitle
                navigationTitleStatusStep += 1
            }
        } else {
            if navigationTitleStatusStep >= STATUS_TITLE_BREAKPOINT {
                navigationTitleStatusStep = 0
                let fadeOutTextAnimation = CATransition()
                fadeOutTextAnimation.duration = 0.3
                fadeOutTextAnimation.type = CATransitionType.fade
                (navigationItem.titleView as? UILabel)?.layer.add(fadeOutTextAnimation, forKey: "fadeOutText")
                (navigationItem.titleView as? UILabel)?.text = ""
            }
        }
    }

    func isNavBarHidden() -> Bool {
        return navigationTitleStatusStep >= 2
    }
}

extension PXComponentContainerViewController {
    func animateContentView(customAnimations: [StockAnimation]? = nil, completion: CompletionHandler? = nil) {
        if let animationCustom = customAnimations {
            contentView.getContentView().pxSpruce.animate(animationCustom, sortFunction: PXSpruce.PXDefaultAnimation.appearSortFunction, completion: completion)
        } else {
            contentView.getContentView().pxSpruce.animate(PXSpruce.PXDefaultAnimation.slideUpAnimation, sortFunction: PXSpruce.PXDefaultAnimation.appearSortFunction, completion: completion)
        }
    }

    func prepareForAnimation(customAnimations: [StockAnimation]? = nil) {
        if let animationCustom = customAnimations {
            contentView.getContentView().pxSpruce.prepare(with: animationCustom)
        } else {
            contentView.getContentView().pxSpruce.prepare(with: PXSpruce.PXDefaultAnimation.slideUpAnimation)
        }
    }
}
