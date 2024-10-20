import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Started with BountiesTN</DialogTitle>
          <DialogDescription>
            Follow these steps to start using our bounty platform:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">1. Create an Account</h3>
            <p>Sign up or log in to access all features of the platform.</p>
          </div>
          <div>
            <h3 className="font-semibold">2. Explore Bounties</h3>
            <p>Browse through the list of open bounties on the home page.</p>
          </div>
          <div>
            <h3 className="font-semibold">3. Submit Solutions</h3>
            <p>Choose a bounty and submit your solution to earn rewards.</p>
          </div>
          <div>
            <h3 className="font-semibold">4. Create Bounties</h3>
            <p>Have a problem? Create your own bounty and offer rewards for solutions.</p>
          </div>
          <div>
            <h3 className="font-semibold">5. Engage with the Community</h3>
            <p>Collaborate, learn, and grow with other developers on the platform.</p>
          </div>
        </div>
        <Button onClick={onClose} className="mt-4">Got it!</Button>
      </DialogContent>
    </Dialog>
  );
};

export default GetStartedModal;

