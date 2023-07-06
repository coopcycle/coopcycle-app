//
//  PXAnimatedButton.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 27/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal class PXAnimatedButton: UIButton {
    weak var animationDelegate: PXAnimatedButtonDelegate?
    var progressView: ProgressView?
    var status: Status = .normal

    let normalText: String
    let loadingText: String
    let retryText: String

    private var buttonColor: UIColor?
    private var animatedView: UIView?

    init(normalText: String, loadingText: String, retryText: String) {
        self.normalText = normalText
        self.loadingText = loadingText
        self.retryText = retryText
        super.init(frame: .zero)
        setTitle(normalText, for: .normal)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    enum Status {
        case normal
        case loading
        case expanding
        // MARK: Uncomment for Shake button
        //        case shaking
    }
}

// MARK: Animations
extension PXAnimatedButton: ProgressViewDelegate, CAAnimationDelegate {
    func startLoading(timeOut: TimeInterval = 15.0) {
        progressView = ProgressView(forView: self, loadingColor: #colorLiteral(red: 0.2666666667, green: 0.2666876018, blue: 0.2666300237, alpha: 0.4), timeOut: timeOut)
        progressView?.progressDelegate = self
        setTitle(loadingText, for: .normal)
        status = .loading
    }

    func finishAnimatingButton(color: UIColor, image: UIImage?) {
        status = .expanding

        progressView?.doComplete(completion: { [weak self] _ in
            guard let self = self else { return }
            self.animatedView = UIView(frame: self.frame)
            guard let animatedView = self.animatedView else { return }
            animatedView.backgroundColor = self.backgroundColor
            animatedView.layer.cornerRadius = self.layer.cornerRadius
            self.superview?.addSubview(animatedView)
            self.alpha = 0

            let toCircleFrame = CGRect(x: self.frame.midX - self.frame.height / 2, y: self.frame.minY, width: self.frame.height, height: self.frame.height)

            let transitionAnimator = UIViewPropertyAnimator(duration: 0.5, dampingRatio: 1, animations: {
                animatedView.frame = toCircleFrame
                animatedView.layer.cornerRadius = toCircleFrame.height / 2
            })

            transitionAnimator.addCompletion({ [weak self] (_) in
                self?.explosion(color: color, newFrame: toCircleFrame, image: image)
            })

            transitionAnimator.startAnimation()
        })
    }

    private func explosion(color: UIColor, newFrame: CGRect, image: UIImage?) {
        guard let animatedView = self.animatedView else { return }

        UIView.animate(withDuration: 0.3, animations: { [weak self] in
            self?.progressView?.alpha = 0
            animatedView.backgroundColor = color
        }, completion: { _ in

            let scaleFactor: CGFloat = 0.40
            let iconImage = UIImageView(frame: CGRect(x: newFrame.width / 2 - (newFrame.width * scaleFactor) / 2, y: newFrame.width / 2 - (newFrame.width * scaleFactor) / 2, width: newFrame.width * scaleFactor, height: newFrame.height * scaleFactor))

            iconImage.image = image
            iconImage.contentMode = .scaleAspectFit
            iconImage.alpha = 0

            animatedView.addSubview(iconImage)

            PXFeedbackGenerator.successNotificationFeedback()

            UIView.animate(withDuration: 0.6, animations: {
                iconImage.alpha = 1
                iconImage.transform = CGAffineTransform(scaleX: 1.0, y: 1.0)
            }, completion: { _ in
                UIView.animate(withDuration: 0.4, animations: {
                    iconImage.alpha = 0
                }, completion: { [weak self] _ in
                    guard let self = self else { return }
                    self.superview?.layer.masksToBounds = false
                    self.animationDelegate?.expandAnimationInProgress()
                    UIView.animate(withDuration: 0.5, animations: {
                        animatedView.transform = CGAffineTransform(scaleX: 50, y: 50)
                    }, completion: { [weak self] _ in
                        self?.animationDelegate?.didFinishAnimation()
                    })
                })
            })
        })
    }

    func didFinishProgress() {
        progressView?.doReset()
    }

    func showErrorToast() {
        self.status = .normal
        self.resetButton()
        self.isUserInteractionEnabled = false
        PXComponentFactory.SnackBar.showShortDurationMessage(message: "review_and_confirm_toast_error".localized) {
            self.animationDelegate?.shakeDidFinish()
            self.isUserInteractionEnabled = true
        }
    }

    // MARK: Uncomment for Shake button
    //    func shake() {
    //        status = .shaking
    //        resetButton()
    //        setTitle(retryText, for: .normal)
    //        UIView.animate(withDuration: 0.1, animations: {
    //            self.backgroundColor = ThemeManager.shared.rejectedColor()
    //        }, completion: { _ in
    //            let animation = CABasicAnimation(keyPath: "position")
    //            animation.duration = 0.1
    //            animation.repeatCount = 4
    //            animation.autoreverses = true
    //            animation.fromValue = NSValue(cgPoint: CGPoint(x: self.center.x - 3, y: self.center.y))
    //            animation.toValue = NSValue(cgPoint: CGPoint(x: self.center.x + 3, y: self.center.y))
    //
    //            CATransaction.setCompletionBlock {
    //                self.isUserInteractionEnabled = true
    //                self.animationDelegate?.shakeDidFinish()
    //                self.status = .normal
    //                UIView.animate(withDuration: 0.3, animations: {
    //                    self.backgroundColor = ThemeManager.shared.getAccentColor()
    //                })
    //            }
    //            self.layer.add(animation, forKey: "position")
    //
    //            CATransaction.commit()
    //        })
    //    }

    func progressTimeOut() {
        progressView?.doReset()
        animationDelegate?.progressButtonAnimationTimeOut()
    }

    func resetButton() {
        setTitle(normalText, for: .normal)
        progressView?.stopTimer()
        progressView?.doReset()
    }

    func isAnimated() -> Bool {
        return status != .normal
    }

    func show(duration: Double = 0.5) {
        UIView.animate(withDuration: duration) { [weak self] in
            self?.alpha = 1
        }
    }

    func hide(duration: Double = 0.5) {
        UIView.animate(withDuration: duration) { [weak self] in
            self?.alpha = 0
        }
    }
}

// MARK: Business Logic
extension PXAnimatedButton {
    @objc func animateFinish(_ sender: NSNotification) {
        if let notificationObject = sender.object as? PXAnimatedButtonNotificationObject {
            let image = ResourceManager.shared.getBadgeImageWith(status: notificationObject.status, statusDetail: notificationObject.statusDetail, clearBackground: true)
            let color = ResourceManager.shared.getResultColorWith(status: notificationObject.status, statusDetail: notificationObject.statusDetail)
            finishAnimatingButton(color: color, image: image)
        }
    }
}

extension PXAnimatedButton {
    func setEnabled(animated: Bool = true) {
        isUserInteractionEnabled = true
        if backgroundColor == ThemeManager.shared.greyColor() {
            let duration = animated ? 0.3 : 0
            UIView.animate(withDuration: duration) { [weak self] in
                self?.backgroundColor = self?.buttonColor
            }
        }
    }

    func setDisabled(animated: Bool = true) {
        if backgroundColor != ThemeManager.shared.greyColor() {
            buttonColor = backgroundColor
            isUserInteractionEnabled = false
            let duration = animated ? 0.3 : 0
            UIView.animate(withDuration: duration) { [weak self] in
                self?.backgroundColor = ThemeManager.shared.greyColor()
            }
        }
    }
}
