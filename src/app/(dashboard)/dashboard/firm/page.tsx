'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, Plus, BadgeCheck, Loader2, Users, UserPlus, X, Eye, Clock, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { firmService } from '@/services/firm.service';
import { teamService } from '@/services/team.service';
import { Firm, FIRM_TYPE_CHOICES } from '@/types/firm.types';
import { Role, Invite, FirmMember } from '@/types/team.types';
import { formatDateTime } from '@/lib/helpers/date-formatter';

// Validation schema for invite form
const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role_id: z.number().min(1, 'Please select a role'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

function FirmInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-2 border-amber-100 shadow-sm">
      <span className="text-2xl font-bold text-white">{initials}</span>
    </div>
  );
}

function FirmTypeBadge({ type }: { type: string }) {
  const label = FIRM_TYPE_CHOICES.find((c) => c.value === type)?.label ?? type;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-100">
      <BadgeCheck className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function FirmCard({ firm }: { firm: Firm }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-5 p-8 border-b border-gray-50">
        {firm.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firm.logo}
            alt={`${firm.name} logo`}
            className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm"
          />
        ) : (
          <FirmInitials name={firm.name} />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900">{firm.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <FirmTypeBadge type={firm.firm_type} />
            {firm.is_active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoRow
            icon={<Mail className="w-4 h-4 text-gray-400" />}
            label="Email"
            value={firm.email}
          />
          <InfoRow
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            label="Phone"
            value={firm.phone}
          />
          <InfoRow
            icon={<MapPin className="w-4 h-4 text-gray-400" />}
            label="Address"
            value={firm.address}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm mb-5">
        <Building2 className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">No Firm Registered</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        You haven&apos;t set up your law firm profile yet.
      </p>
    </div>
  );
}

export default function FirmManagementPage() {
  const [firm, setFirm] = useState<Firm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [members, setMembers] = useState<FirmMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role_id: 0,
    },
  });

  useEffect(() => {
    const fetchFirm = async () => {
      try {
        const response = await firmService.getFirm();
        if (response.success && response.data) {
          setFirm(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFirm();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('Fetching firm members...');
        const response = await teamService.getFirmMembers();
        console.log('Firm Members Response:', response);
        if (response.success && response.data) {
          console.log('Firm Members Data:', response.data);
          setMembers(response.data);
        }
      } catch (err) {
        console.error('Error fetching firm members:', err);
      }
    };
    if (firm) {
      fetchMembers();
    }
  }, [firm]);

  useEffect(() => {
    if (firm && isModalOpen && roles.length === 0) {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firm, isModalOpen]);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await teamService.getRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        toast.error('Failed to load roles');
      }
    } catch (err) {
      toast.error('Failed to load roles');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const onInviteSubmit = async (data: InviteFormData) => {
    setIsInviting(true);
    try {
      const response = await teamService.inviteMember({
        email: data.email,
        role_id: data.role_id,
      });

      if (response.success) {
        toast.success('Invitation sent successfully');
        reset();
        setIsModalOpen(false);
        // Refresh invites if they are currently being viewed
        if (showInvites) {
          fetchInvites();
        }
      } else {
        toast.error(response.message || 'Failed to send invitation');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const fetchInvites = async () => {
    setIsLoadingInvites(true);
    try {
      const response = await teamService.getInvites();
      if (response.success && response.data) {
        setInvites(response.data);
      } else {
        toast.error('Failed to load invites');
      }
    } catch (err) {
      toast.error('Failed to load invites');
    } finally {
      setIsLoadingInvites(false);
    }
  };

  const handleViewInvites = () => {
    setShowInvites(true);
    setShowMembers(false);
    fetchInvites();
  };

  const handleViewMembers = () => {
    setShowMembers(true);
    setShowInvites(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading firm details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Firm Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {firm ? 'Your registered law firm details.' : 'Manage your law firm profile and settings.'}
          </p>
        </div>
      </div>

      {/* Content */}
      {error || !firm ? (
        <EmptyState />
      ) : (
        <>
          <FirmCard firm={firm} />
          
          {/* Team Members Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Team Members</h2>
                  <p className="text-xs text-gray-500">Invite and manage your team</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!showInvites && (
                  <Button
                    onClick={handleViewInvites}
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Invites
                  </Button>
                )}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  className="bg-gray-900 text-white hover:bg-amber-700 gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {showInvites ? (
                // Invites Table
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Pending Invitations</h3>
                    <Button
                      onClick={() => setShowInvites(false)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                  </div>

                  {isLoadingInvites ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-500">Loading invitations...</p>
                      </div>
                    </div>
                  ) : invites.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mx-auto mb-4">
                        <Mail className="h-7 w-7 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">No pending invitations</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        All invitations have been accepted or expired.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-blue-100 bg-blue-50">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-blue-900 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-blue-900 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-blue-900 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-blue-900 uppercase tracking-wider">
                              Sent
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-blue-900 uppercase tracking-wider">
                              Expires
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {invites.map((invite) => (
                            <tr key={invite.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-900">{invite.email}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                                  {invite.role_name}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {invite.is_used ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Accepted
                                  </span>
                                ) : new Date(invite.expires_at) < new Date() ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Expired
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                                    <Clock className="w-3.5 h-3.5" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-900">
                                  {formatDateTime(invite.created_at).date}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {formatDateTime(invite.created_at).time}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-900">
                                  {formatDateTime(invite.expires_at).date}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {formatDateTime(invite.expires_at).time}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                // Members Table (Default View)
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Active Team Members</h3>
                  </div>

                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <p className="text-sm text-gray-500">Loading team members...</p>
                      </div>
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 mx-auto mb-4">
                        <Users className="h-7 w-7 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">No team members yet</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        Start building your team by inviting members to join your firm.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-green-100 bg-green-50">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Mobile
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Role(s)
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-green-900 uppercase tracking-wider">
                              Joined
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {members.map((member) => (
                            <tr key={member.id} className="hover:bg-green-50/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium text-gray-900">{member.full_name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-600">{member.email}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-600">{member.mobile_number}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {member.roles.map((role, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200"
                                    >
                                      {role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {member.is_activated === 1 && member.status === 1 ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-900">
                                  {formatDateTime(member.date_joined).date}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {formatDateTime(member.date_joined).time}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Invite Member Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your firm. They will receive an email with instructions to activate their account.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onInviteSubmit)} className="space-y-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      {...register('email')}
                      className={errors.email ? 'border-red-300' : ''}
                      disabled={isInviting}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role_id" className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    {isLoadingRoles ? (
                      <div className="flex items-center justify-center h-10 border border-gray-200 rounded-lg bg-white">
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <select
                        id="role_id"
                        {...register('role_id', { valueAsNumber: true })}
                        className={`flex h-10 w-full rounded-lg border ${
                          errors.role_id ? 'border-red-300' : 'border-gray-200'
                        } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isInviting}
                      >
                        <option value={0}>Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.role_id && (
                      <p className="text-xs text-red-600">{errors.role_id.message}</p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      reset();
                    }}
                    disabled={isInviting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isInviting}
                    className="bg-gray-900 text-white hover:bg-amber-700 gap-2"
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Send Invite
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
