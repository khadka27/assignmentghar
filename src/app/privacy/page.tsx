export const metadata = {
  title: "Privacy Policy - AssignmentGhar",
  description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              At AssignmentGhar, we take your privacy seriously. We are
              committed to protecting your personal data and ensuring you have a
              positive experience on our platform.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              All personal information collected is used solely for providing
              our services and improving your experience. We never share your
              data with third parties without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Confidentiality</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Your assignments, communications, and personal details are
              completely confidential. We maintain strict confidentiality
              agreements with all our consultants and staff members.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              All chat conversations and uploaded files are encrypted and stored
              securely. Only authorized personnel have access to your
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Secure QR Payment</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Our QR payment system uses industry-standard encryption to protect
              your financial information. Payment details are never stored on
              our servers.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              All transactions are processed through secure payment gateways
              with PCI DSS compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">File Security</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Files you upload are stored in secure, encrypted storage. We
              automatically delete files after 90 days unless you request
              otherwise.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              You have full control over your data and can request deletion at
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400">
              If you have any questions about our privacy practices, please
              contact us at support@assignmentghar.com
            </p>
          </section>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Last Updated:</strong> October 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
