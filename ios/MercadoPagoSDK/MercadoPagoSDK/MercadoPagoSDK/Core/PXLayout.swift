//
//  PXLayout.swift
//  TestAutolayout
//
//  Created by Demian Tejo on 10/18/17.
//  Copyright © 2017 Demian Tejo. All rights reserved.
//

import UIKit

class PXLayout: NSObject {

    //Margins
    static let ZERO_MARGIN: CGFloat = 0.0
    static let XXXS_MARGIN: CGFloat = 4.0
    static let XXS_MARGIN: CGFloat = 8.0
    static let XS_MARGIN: CGFloat = 12.0
    static let S_MARGIN: CGFloat = 16.0
    static let M_MARGIN: CGFloat = 24.0
    static let L_MARGIN: CGFloat = 32.0
    static let XL_MARGIN: CGFloat = 40.0
    static let XXL_MARGIN: CGFloat = 48.0
    static let XXXL_MARGIN: CGFloat = 50.0

    //Font Sizes
    static let XXXS_FONT: CGFloat = 12.0
    static let XXS_FONT: CGFloat = 14.0
    static let XS_FONT: CGFloat = 16.0
    static let S_FONT: CGFloat = 18.0
    static let M_FONT: CGFloat = 20.0
    static let L_FONT: CGFloat = 22.0
    static let XL_FONT: CGFloat = 24.0
    static let XXL_FONT: CGFloat = 26.0
    static let XXXL_FONT: CGFloat = 26.0

    static let DEFAULT_CONTRAINT_ACTIVE = true

    static let NAV_BAR_HEIGHT: CGFloat = 44

    static func checkContraintActivation(_ constraint: NSLayoutConstraint, withDefault isActive: Bool = DEFAULT_CONTRAINT_ACTIVE) -> NSLayoutConstraint {
        constraint.isActive = isActive
        return constraint
    }

    //Altura fija
    @discardableResult
    static func setHeight(owner: UIView, height: CGFloat, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        owner.translatesAutoresizingMaskIntoConstraints = false
        return checkContraintActivation(NSLayoutConstraint(item: owner, attribute: .height, relatedBy: relation, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: height))
    }

    //Ancho fijo
    @discardableResult
    static func setWidth(owner: UIView, width: CGFloat, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        return checkContraintActivation(NSLayoutConstraint(item: owner, attribute: .width, relatedBy: relation, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: width))
    }

    // Pin Left
    @discardableResult
    static func pinLeft(view: UIView, to otherView: UIView? = nil, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: .leading, relatedBy: relation, toItem: superView, attribute: .leading, multiplier: 1, constant: margin))
    }
    //Pin Right
    @discardableResult
    static func pinRight(view: UIView, to otherView: UIView? = nil, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: .trailing, relatedBy: relation, toItem: superView, attribute: .trailing, multiplier: 1, constant: -margin))
    }
    //Pin Top
    @discardableResult
    static func pinTop(view: UIView, to otherView: UIView? = nil, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: .top, relatedBy: relation, toItem: superView, attribute: .top, multiplier: 1, constant: margin))
    }
    //Pin Bottom
    @discardableResult
    static func pinBottom(view: UIView, to otherView: UIView? = nil, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: .bottom, relatedBy: relation, toItem: superView, attribute: .bottom, multiplier: 1, constant: -margin))
    }

    //Pin All Edges to Superview
    @discardableResult
    static func pinAllEdges(view: UIView, to otherView: UIView? = nil, withMargin margin: CGFloat = 0 ) -> [NSLayoutConstraint] {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }

        let topConstraint = checkContraintActivation(NSLayoutConstraint(item: view, attribute: .top, relatedBy: .equal, toItem: superView, attribute: .top, multiplier: 1, constant: margin))
        let bottomConstraint = checkContraintActivation(NSLayoutConstraint(item: view, attribute: .bottom, relatedBy: .equal, toItem: superView, attribute: .bottom, multiplier: 1, constant: -margin))
        let leftConstraint = checkContraintActivation(NSLayoutConstraint(item: view, attribute: .left, relatedBy: .equal, toItem: superView, attribute: .left, multiplier: 1, constant: margin))
        let rightConstraint = checkContraintActivation(NSLayoutConstraint(item: view, attribute: .right, relatedBy: .equal, toItem: superView, attribute: .right, multiplier: 1, constant: -margin))

        return [topConstraint, bottomConstraint, leftConstraint, rightConstraint]
    }

    //Pin parent last subview to Bottom
    @discardableResult
    static func pinLastSubviewToBottom(view: UIView, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint? {
        guard let lastView = view.subviews.last else {
            return nil
        }
        return pinBottom(view: lastView, to: view, withMargin: margin, relation: relation)
    }

    //Pin parent first subview to Top
    @discardableResult
    static func pinFirstSubviewToTop(view: UIView, withMargin margin: CGFloat = 0 ) -> NSLayoutConstraint? {
        guard let firstView = view.subviews.first else {
            return nil
        }
        return pinTop(view: firstView, to: view, withMargin: margin)
    }

    //Vista 1 abajo de vista 2
    @discardableResult
    static func put(view: UIView, onBottomOf view2: UIView, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = NSLayoutConstraint.Relation.equal) -> NSLayoutConstraint {
        return checkContraintActivation(NSLayoutConstraint(
            item: view,
            attribute: .top,
            relatedBy: relation,
            toItem: view2,
            attribute: .bottom,
            multiplier: 1.0,
            constant: margin
        ))
    }
    //Vista 1 abajo de la ultima vista
    @discardableResult
    static func put(view: UIView, onBottomOfLastViewOf view2: UIView, withMargin margin: CGFloat = 0) -> NSLayoutConstraint? {
        if !view2.subviews.contains(view) {
            return nil
        }
        for actualView in view2.subviews.reversed() where actualView != view {
            return put(view: view, onBottomOf: actualView, withMargin: margin)
        }
        return nil
    }

    //Vista 1 arriba de vista 2
    @discardableResult
    static func put(view: UIView, aboveOf view2: UIView, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = NSLayoutConstraint.Relation.equal) -> NSLayoutConstraint {
        return checkContraintActivation(NSLayoutConstraint(
            item: view,
            attribute: .bottom,
            relatedBy: relation,
            toItem: view2,
            attribute: .top,
            multiplier: 1.0,
            constant: margin
        ))
    }

    //Vista 1 a la izquierda de vista 2
    @discardableResult
    static func put(view: UIView, leftOf view2: UIView, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        return checkContraintActivation(NSLayoutConstraint(
            item: view,
            attribute: .right,
            relatedBy: relation,
            toItem: view2,
            attribute: .left,
            multiplier: 1.0,
            constant: -margin
        ))
    }

    //Vista 1 a la derecha de vista 2
    @discardableResult
    static func put(view: UIView, rightOf view2: UIView, withMargin margin: CGFloat = 0, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        return checkContraintActivation(NSLayoutConstraint(
            item: view,
            attribute: .left,
            relatedBy: relation,
            toItem: view2,
            attribute: .right,
            multiplier: 1.0,
            constant: margin
        ))
    }

    //Centrado horizontal
    @discardableResult
    static func centerHorizontally(view: UIView, to container: UIView? = nil) -> NSLayoutConstraint {
        var superView: UIView!
        if container == nil {
            superView = view.superview
        } else {
            superView = container
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: NSLayoutConstraint.Attribute.centerX, relatedBy: .equal, toItem: superView, attribute: NSLayoutConstraint.Attribute.centerX, multiplier: 1.0, constant: 0))
    }

    //Centrado Vertical
    @discardableResult
    static func centerVertically(view: UIView, to container: UIView? = nil, withMargin margin: CGFloat = 0) -> NSLayoutConstraint {
        var superView: UIView!
        if container == nil {
            superView = view.superview
        } else {
            superView = container
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: NSLayoutConstraint.Attribute.centerY, relatedBy: .equal, toItem: superView, attribute: NSLayoutConstraint.Attribute.centerY, multiplier: 1.0, constant: margin))
    }

    @discardableResult
    static func matchWidth(ofView view: UIView, toView otherView: UIView? = nil, withPercentage percent: CGFloat = 100, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: NSLayoutConstraint.Attribute.width, relatedBy: relation, toItem: superView, attribute: NSLayoutConstraint.Attribute.width, multiplier: percent / 100, constant: 0))
    }

    @discardableResult
    static func matchHeight(ofView view: UIView, toView otherView: UIView? = nil, withPercentage percent: CGFloat = 100, relation: NSLayoutConstraint.Relation = .equal) -> NSLayoutConstraint {
        var superView: UIView!
        if otherView == nil {
            superView = view.superview
        } else {
            superView = otherView
        }
        return checkContraintActivation(NSLayoutConstraint(item: view, attribute: NSLayoutConstraint.Attribute.height, relatedBy: relation, toItem: superView, attribute: NSLayoutConstraint.Attribute.height, multiplier: percent / 100, constant: 0))
    }

    static func getScreenWidth(applyingMarginFactor percent: CGFloat = 100) -> CGFloat {
        let screenSize = UIScreen.main.bounds
        let availableWidth = screenSize.width * percent / 100
        return availableWidth
    }

    static func getAvailabelScreenHeight(in viewController: UIViewController, applyingMarginFactor percent: CGFloat = 100) -> CGFloat {
        let screenHeight = getScreenHeight()
        let topBarHeight = UIApplication.shared.statusBarFrame.size.height + (viewController.navigationController?.navigationBar.frame.height ?? 0.0)
        let availableScreenHeight = screenHeight - topBarHeight
        return availableScreenHeight * percent / 100
    }

    static func getScreenHeight(applyingMarginFactor percent: CGFloat = 100) -> CGFloat {
        let screenSize = UIScreen.main.bounds
        let availableHeight = screenSize.height * percent / 100
        return availableHeight
    }

}

extension PXLayout {
    static func getSafeAreaBottomInset() -> CGFloat {
        // iPhoneX or any device with safe area inset > 0
        var bottomDeltaMargin: CGFloat = 0
        if #available(iOS 11.0, *) {
            let window = UIApplication.shared.keyWindow
            let bottomSafeAreaInset = window?.safeAreaInsets.bottom
            if let bottomDeltaInset = bottomSafeAreaInset, bottomDeltaInset > 0 {
                bottomDeltaMargin = bottomDeltaInset
            }
        }
        return bottomDeltaMargin
    }

    static func getSafeAreaTopInset(topDeltaMargin: CGFloat = 0) -> CGFloat {
        // iPhoneX or any device with safe area inset > 0
        var topDeltaMargin: CGFloat = topDeltaMargin
        if #available(iOS 11.0, *) {
            let window = UIApplication.shared.keyWindow
            let topSafeAreaInset = window?.safeAreaInsets.top
            if let topDeltaInset = topSafeAreaInset, topDeltaInset > 0 {
                topDeltaMargin = topDeltaInset
            }
        }
        return topDeltaMargin
    }

    static func getStatusBarHeight() -> CGFloat {
        let defaultStatusBarHeight: CGFloat = 20
        return getSafeAreaTopInset(topDeltaMargin: defaultStatusBarHeight)
    }
}

class ClosureSleeve {
    let closure: () -> Void

    init (_ closure: @escaping () -> Void) {
        self.closure = closure
    }

    @objc func invoke () {
        closure()
    }
}

extension UIControl {
    func add (for controlEvents: UIControl.Event, _ closure: @escaping () -> Void) {
        let sleeve = ClosureSleeve(closure)
        addTarget(sleeve, action: #selector(ClosureSleeve.invoke), for: controlEvents)
        objc_setAssociatedObject(self, String(format: "[%d]", arc4random()), sleeve, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN)
    }
}
