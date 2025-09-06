import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobById, clearCurrentJob } from '../store/slices/jobsSlice';
import { Card, LoadingSpinner, Button } from '@online-hiring-system/ui';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentJob, isLoading, error } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
    
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading job: {error || 'Job not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentJob.title}</h1>
            <p className="text-xl text-gray-600 mt-2">{currentJob.employer.companyName}</p>
            <p className="text-gray-500 mt-1">{currentJob.location}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentJob.status === 'PUBLISHED' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentJob.status}
            </span>
            <p className="text-sm text-gray-500 mt-2">{currentJob.views} views</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {currentJob.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{currentJob.description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            Posted on {new Date(currentJob.createdAt).toLocaleDateString()}
          </p>
          <Button className="btn-primary">
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
};
