//
//  TextFieldsEffects.swift
//  TextFieldEffects
//
//  Created by Raúl Riera on 24/01/2015.
//  Copyright (c) 2015 Raul Riera. All rights reserved.
//

import UIKit

internal extension String {
    /**
    true iff self contains characters.
    */
    var isNotEmpty: Bool {
        return !isEmpty
    }
}

/**
A TextFieldEffects object is a control that displays editable text and contains the boilerplates to setup unique animations for text entrey and display. You typically use this class the same way you use UITextField.
*/
internal class TextFieldEffects: MPTextField {

    /**
    UILabel that holds all the placeholder information
    */
    let placeholderLabel = MPLabel()

    /**
    Creates all the animations that are used to leave the textfield in the "entering text" state.
    */
    func animateViewsForTextEntry() {
        fatalError("\(#function) must be overridden")
    }

    /**
    Creates all the animations that are used to leave the textfield in the "display input text" state.
    */
    func animateViewsForTextDisplay() {
        fatalError("\(#function) must be overridden")
    }

    /**
    Draws the receiver’s image within the passed-in rectangle.
    
    - parameter rect:	The portion of the view’s bounds that needs to be updated.
    */
    func drawViewsForRect(_ rect: CGRect) {
        fatalError("\(#function) must be overridden")
    }

    func updateViewsForBoundsChange(_ bounds: CGRect) {
        fatalError("\(#function) must be overridden")
    }

    // MARK: - Overrides

    override open func draw(_ rect: CGRect) {
        drawViewsForRect(rect)
    }

    override open func drawPlaceholder(in rect: CGRect) {
        // Don't draw any placeholders
    }

    override open var text: String? {
        didSet {
            if let text = text, text.isNotEmpty {
                animateViewsForTextEntry()
            } else {
                animateViewsForTextDisplay()
            }
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    // MARK: - UITextField Observing

    override open func willMove(toSuperview newSuperview: UIView!) {
        if newSuperview != nil {
            NotificationCenter.default.addObserver(self, selector: #selector(TextFieldEffects.textFieldDidEndEditing), name: UITextField.textDidEndEditingNotification, object: self)

            NotificationCenter.default.addObserver(self, selector: #selector(TextFieldEffects.textFieldDidBeginEditing), name: UITextField.textDidBeginEditingNotification, object: self)
        }
    }

    /**
    The textfield has started an editing session.
    */
    @objc open func textFieldDidBeginEditing() {
        animateViewsForTextEntry()
    }

    /**
    The textfield has ended an editing session.
    */
    @objc open func textFieldDidEndEditing() {
        animateViewsForTextDisplay()
    }

    // MARK: - Interface Builder

    override open func prepareForInterfaceBuilder() {
        drawViewsForRect(frame)
    }
}
