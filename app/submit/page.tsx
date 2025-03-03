import { SubmitForm } from '../../components/SubmitForm';

export default function SubmitPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Submit Your Advice</h1>
      <SubmitForm />
    </div>
  );
}