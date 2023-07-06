//
//  PXOneTapViewControllerTransition.swift
//  MercadoPagoSDK
//
//  Created by Eric Ertl on 24/10/2019.
//

import Foundation
import MLCardForm

class PXOneTapViewControllerTransition: NSObject, UIViewControllerAnimatedTransitioning {

    //make this zero for now and see if it matters when it comes time to make it interactive
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 1.0
    }

    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        if let fromVC = transitionContext.viewController(forKey: .from) as? PXOneTapViewController,
            let toVC = transitionContext.viewController(forKey: .to) as? MLCardFormViewController {
            animateFromOneTap(transitionContext: transitionContext, oneTapVC: fromVC, addCardVC: toVC)
        } else if let fromVC = transitionContext.viewController(forKey: .from) as? MLCardFormViewController,
            let toVC = transitionContext.viewController(forKey: .to) as? PXOneTapViewController {
            animateToOneTap(transitionContext: transitionContext, oneTapVC: toVC, addCardVC: fromVC)
        } else {
            transitionContext.completeTransition(false)
        }
    }

    private func animateFromOneTap(transitionContext: UIViewControllerContextTransitioning, oneTapVC: PXOneTapViewController, addCardVC: UIViewController) {
        guard let headerSnapshot = oneTapVC.headerView?.snapshotView(afterScreenUpdates: false),
            let footerSnapshot = oneTapVC.whiteView?.snapshotView(afterScreenUpdates: false) else {
                transitionContext.completeTransition(false)
                return
        }

        let containerView = transitionContext.containerView
        let fixedFrames = buildFrames(oneTapVC: oneTapVC, containerView: containerView)

        headerSnapshot.frame = fixedFrames.headerFrame
        footerSnapshot.frame = fixedFrames.footerFrame

        let navigationSnapshot = oneTapVC.view.resizableSnapshotView(from: fixedFrames.navigationFrame, afterScreenUpdates: false, withCapInsets: .zero)
        // topView is a view containing a snapshot of the navigationbar and a snapshot of the headerView
        let topView = buildTopView(containerView: containerView, navigationSnapshot: navigationSnapshot, headerSnapshot: headerSnapshot, footerSnapshot: footerSnapshot)
        // addTopViewOverlay adds a blue placeholder view to hide topView elements
        // This view will show initially translucent and will become opaque to cover the headerView area
        addTopViewOverlay(topView: topView, backgroundColor: oneTapVC.view.backgroundColor)

        oneTapVC.view.removeFromSuperview()
        containerView.addSubview(addCardVC.view)
        containerView.addSubview(topView)
        containerView.addSubview(footerSnapshot)

        topView.addSubview(buildTopViewOverlayColor(color: oneTapVC.view.backgroundColor, topView: topView))

        var pxAnimator = PXAnimator(duration: 0.8, dampingRatio: 0.8)
        pxAnimator.addAnimation(animation: {
            topView.frame = topView.frame.offsetBy(dx: 0, dy: -fixedFrames.headerFrame.size.height)
            footerSnapshot.frame = footerSnapshot.frame.offsetBy(dx: 0, dy: footerSnapshot.frame.size.height)
        })

        pxAnimator.addCompletion(completion: {
            topView.removeFromSuperview()
            footerSnapshot.removeFromSuperview()
            transitionContext.completeTransition(!transitionContext.transitionWasCancelled)
        })

        pxAnimator.animate()
    }

    private func animateToOneTap(transitionContext: UIViewControllerContextTransitioning, oneTapVC: PXOneTapViewController, addCardVC: UIViewController) {
        guard let toVCSnapshot = oneTapVC.view.snapshotView(afterScreenUpdates: true),
            let headerSnapshot = oneTapVC.headerView?.snapshotView(afterScreenUpdates: true),
            let footerSnapshot = oneTapVC.whiteView?.snapshotView(afterScreenUpdates: true) else {
                transitionContext.completeTransition(false)
                return
        }

        addCardVC.title = nil

        let containerView = transitionContext.containerView
        let fixedFrames = buildFrames(oneTapVC: oneTapVC, containerView: containerView)

        headerSnapshot.frame = fixedFrames.headerFrame
        footerSnapshot.frame = fixedFrames.footerFrame

        let navigationSnapshot = toVCSnapshot.resizableSnapshotView(from: fixedFrames.navigationFrame, afterScreenUpdates: true, withCapInsets: .zero)
        // topView is a view containing a snapshot of the navigationbar and a snapshot of the headerView
        let topView = buildTopView(containerView: containerView, navigationSnapshot: navigationSnapshot, headerSnapshot: headerSnapshot, footerSnapshot: footerSnapshot)
        // backgroundView is a white placeholder background using the entire view area
        let backgroundView = UIView(frame: containerView.frame)
        backgroundView.backgroundColor = UIColor.white
        // topViewBackground is a blue placeholder background to use as a temporary navigationbar and headerView background
        // This view will show initially offset as the navigationbar and will expand to cover the headerView area
        let topViewBackground = UIView(frame: topView.frame)
        topViewBackground.backgroundColor = oneTapVC.view.backgroundColor
        backgroundView.addSubview(topViewBackground)
        backgroundView.addSubview(topView)
        backgroundView.addSubview(footerSnapshot)

        addCardVC.view.removeFromSuperview()
        containerView.addSubview(oneTapVC.view)
        containerView.addSubview(backgroundView)

        topViewBackground.frame = topViewBackground.frame.offsetBy(dx: 0, dy: -fixedFrames.headerFrame.size.height)
        topView.frame = topView.frame.offsetBy(dx: 0, dy: -fixedFrames.headerFrame.size.height)
        topView.alpha = 0
        footerSnapshot.frame = footerSnapshot.frame.offsetBy(dx: 0, dy: footerSnapshot.frame.size.height)
        footerSnapshot.alpha = 0

        var pxAnimator = PXAnimator(duration: 0.5, dampingRatio: 1.0)
        pxAnimator.addAnimation(animation: {
            topViewBackground.frame = topViewBackground.frame.offsetBy(dx: 0, dy: fixedFrames.headerFrame.size.height)
            footerSnapshot.frame = footerSnapshot.frame.offsetBy(dx: 0, dy: -footerSnapshot.frame.size.height)
            footerSnapshot.alpha = 1
        })

        pxAnimator.addCompletion(completion: {
            var pxAnimator = PXAnimator(duration: 0.5, dampingRatio: 1.0)
            pxAnimator.addAnimation(animation: {
                topView.frame = topView.frame.offsetBy(dx: 0, dy: fixedFrames.headerFrame.size.height)
                topView.alpha = 1
            })

            pxAnimator.addCompletion(completion: {
                backgroundView.removeFromSuperview()

                transitionContext.completeTransition(!transitionContext.transitionWasCancelled)
            })

            pxAnimator.animate()
        })

        pxAnimator.animate()
    }

    private func buildTopView(containerView: UIView, navigationSnapshot: UIView?, headerSnapshot: UIView, footerSnapshot: UIView) -> UIView {
        var topFrame = containerView.frame
        topFrame.size.height -= footerSnapshot.frame.size.height
        let topView = UIView(frame: topFrame)
        if let navigationSnapshot = navigationSnapshot { topView.addSubview(navigationSnapshot) }
        topView.addSubview(headerSnapshot)
        return topView
    }

    private func buildTopViewOverlayColor(color: UIColor?, topView: UIView) -> UIView {
        let topViewOverlay = UIView(frame: topView.frame)
        topViewOverlay.backgroundColor = color
        return topViewOverlay
    }

    private func addTopViewOverlay(topView: UIView, backgroundColor: UIColor?) {
        let topViewOverlay = UIView(frame: topView.frame)
        topViewOverlay.backgroundColor = backgroundColor
        topViewOverlay.alpha = 0
        topView.addSubview(topViewOverlay)
    }

    private func buildFrames(oneTapVC: PXOneTapViewController, containerView: UIView) -> (navigationFrame: CGRect, headerFrame: CGRect, footerFrame: CGRect) {
        // Fix frame sizes and position
        var headerFrame = oneTapVC.headerView?.frame ?? CGRect.zero
        var footerFrame = oneTapVC.whiteView?.frame ?? CGRect.zero

        var navigationFrame = containerView.frame
        navigationFrame.size.height -= (headerFrame.size.height + footerFrame.size.height)
        headerFrame.origin.y = navigationFrame.height
        footerFrame.origin.y = headerFrame.origin.y + headerFrame.size.height

        return (navigationFrame, headerFrame, footerFrame)
    }
}
